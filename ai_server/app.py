# ai_server/app.py (Random Forest version)
# Flask server yang membaca model Random Forest dan melayani prediksi
# Jalankan: python app.py  (port 5001)

from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestRegressor
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ── Load model saat startup ─────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')

print("[AI] Loading model files...")
try:
    model      = joblib.load(os.path.join(MODEL_DIR, 'random_forest.pkl'))
    le_produk  = joblib.load(os.path.join(MODEL_DIR, 'le_produk.pkl'))
    le_ukuran  = joblib.load(os.path.join(MODEL_DIR, 'le_ukuran.pkl'))
    features   = joblib.load(os.path.join(MODEL_DIR, 'features.pkl'))
    print("[AI] ✅ Model Random Forest loaded successfully")
    print(f"[AI]    Features: {features}")
    print(f"[AI]    Produk known: {list(le_produk.classes_)}")
    print(f"[AI]    Ukuran known: {list(le_ukuran.classes_)}")
    MODEL_READY = True
except Exception as e:
    print(f"[AI] ❌ Failed to load model: {e}")
    MODEL_READY = False


def encode_produk(nama_produk):
    try:
        return int(le_produk.transform([nama_produk])[0])
    except ValueError:
        return 0

def encode_ukuran(ukuran):
    try:
        return int(le_ukuran.transform([ukuran])[0])
    except ValueError:
        return 0

def build_prediction(harga, stok, jumlah_terjual, nama_produk, ukuran_benih):
    """Random Forest tidak perlu normalisasi — langsung predict"""
    produk_enc = encode_produk(nama_produk)
    ukuran_enc = encode_ukuran(ukuran_benih)
    raw  = np.array([[harga, stok, jumlah_terjual, produk_enc, ukuran_enc]])
    pred = model.predict(raw)[0]
    return max(0, round(float(pred)))


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok' if MODEL_READY else 'model_not_loaded'})


@app.route('/predict', methods=['POST'])
def predict():
    if not MODEL_READY:
        return jsonify({'error': 'Model belum dimuat'}), 503
    data = request.json or {}
    required = ['harga', 'stok', 'jumlah_terjual', 'nama_produk', 'ukuran_benih']
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({'error': f'Field kurang: {missing}'}), 400
    try:
        pred = build_prediction(
            float(data['harga']), float(data['stok']),
            float(data['jumlah_terjual']), str(data['nama_produk']),
            str(data['ukuran_benih'])
        )
        return jsonify({
            'nama_produk': data['nama_produk'],
            'ukuran_benih': data['ukuran_benih'],
            'prediksi_pembelian': pred,
            'satuan': 'ekor'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    if not MODEL_READY:
        return jsonify({'error': 'Model belum dimuat'}), 503
    products = (request.json or {}).get('products', [])
    if not products:
        return jsonify({'error': 'products kosong'}), 400
    results = []
    for p in products:
        try:
            pred = build_prediction(
                float(p.get('harga', 0)), float(p.get('stok', 0)),
                float(p.get('jumlah_terjual', p.get('sold', 0))),
                str(p.get('nama_produk', p.get('name', ''))),
                str(p.get('ukuran_benih', p.get('size', '2-3 cm')))
            )
            results.append({**p, 'prediksi_pembelian': pred})
        except Exception as e:
            results.append({**p, 'prediksi_pembelian': None, 'error': str(e)})
    results.sort(key=lambda x: x.get('prediksi_pembelian') or 0, reverse=True)
    return jsonify({'predictions': results, 'total': len(results)})


@app.route('/insight', methods=['GET'])
def insight():
    if not MODEL_READY:
        return jsonify({'error': 'Model belum dimuat'}), 503
    combos = []
    for produk in le_produk.classes_:
        for ukuran in le_ukuran.classes_:
            combos.append({'nama_produk': produk, 'ukuran_benih': ukuran})
    harga_map = {'2-3 cm': 100, '3-4 cm': 300, '4-5 cm': 500}
    predictions = []
    for c in combos:
        harga = harga_map.get(c['ukuran_benih'], 300)
        pred  = build_prediction(harga, 3000, 1000, c['nama_produk'], c['ukuran_benih'])
        predictions.append({**c, 'harga': harga, 'prediksi': pred})
    predictions.sort(key=lambda x: x['prediksi'], reverse=True)
    from collections import defaultdict
    by_produk = defaultdict(int)
    for p in predictions:
        by_produk[p['nama_produk']] += p['prediksi']
    top_produk = max(by_produk, key=by_produk.get)
    return jsonify({
        'top_produk': top_produk,
        'top_prediksi_ekor': by_produk[top_produk],
        'ranking_produk': sorted(by_produk.items(), key=lambda x: -x[1]),
        'detail': predictions[:8],
        'produk_available': list(le_produk.classes_),
        'ukuran_available': list(le_ukuran.classes_),
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"[AI] Server running on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
