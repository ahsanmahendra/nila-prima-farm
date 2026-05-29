import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix icon Leaflet yang hilang saat pakai bundler
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Komponen internal: tangkap klik di peta
function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapPicker({ lat, lng, onLocationSelect }) {
  const defaultCenter = [-6.5971, 107.2838] // Cianjur, Jawa Barat (dekat Maninjau)
  const center = lat && lng ? [lat, lng] : defaultCenter

  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert('Browser kamu tidak mendukung GPS.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => onLocationSelect(pos.coords.latitude, pos.coords.longitude),
      () => alert('Tidak bisa mengakses lokasi. Pastikan izin lokasi diaktifkan.')
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          📍 Klik peta untuk menandai lokasi pengiriman
        </p>
        <button
          type="button"
          onClick={handleGPS}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 border border-primary-200 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          🎯 Gunakan Lokasi Saya
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-200" style={{ height: 300 }}>
        <MapContainer
          center={center}
          zoom={lat && lng ? 15 : 10}
          style={{ height: '100%', width: '100%' }}
          key={`${lat}-${lng}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onLocationSelect={onLocationSelect} />
          {lat && lng && <Marker position={[lat, lng]} />}
        </MapContainer>
      </div>

      {lat && lng && (
        <p className="text-xs text-slate-400 font-mono">
          Koordinat: {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>
      )}
    </div>
  )
}
