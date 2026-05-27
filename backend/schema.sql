-- =====================================================
-- DATABASE: nila_prima_farm
-- Nila Prima Farm - Fullstack Ecommerce Benih Ikan Nila
-- =====================================================

CREATE DATABASE IF NOT EXISTS nila_prima_farm
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nila_prima_farm;

-- ─── USERS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(150)  NOT NULL UNIQUE,
  password     VARCHAR(255)  NOT NULL,
  phone        VARCHAR(20)   DEFAULT NULL,
  address      TEXT          DEFAULT NULL,
  city         VARCHAR(100)  DEFAULT NULL,
  province     VARCHAR(100)  DEFAULT NULL,
  postal_code  VARCHAR(10)   DEFAULT NULL,
  role         ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at   DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB;

-- ─── PRODUCTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200)   NOT NULL,
  category      ENUM('Standard','Premium','Super Premium') NOT NULL DEFAULT 'Standard',
  size          VARCHAR(50)    DEFAULT NULL,
  price         DECIMAL(12,2)  NOT NULL,
  stock         INT            NOT NULL DEFAULT 0,
  sold          INT            NOT NULL DEFAULT 0,
  description   TEXT           DEFAULT NULL,
  image         VARCHAR(500)   DEFAULT NULL,
  images        JSON           DEFAULT NULL,
  tags          JSON           DEFAULT NULL,
  specs         JSON           DEFAULT NULL,
  rating        DECIMAL(3,1)   NOT NULL DEFAULT 0.0,
  review_count  INT            NOT NULL DEFAULT 0,
  is_active     TINYINT(1)     NOT NULL DEFAULT 1,
  created_at    DATETIME       DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category  (category),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- ─── CARTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── CART ITEMS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  cart_id    INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cart_product (cart_id, product_id),
  FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── ORDERS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT           NOT NULL,
  order_number     VARCHAR(50)   NOT NULL UNIQUE,
  status           ENUM('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  payment_status   ENUM('pending','settlement','expire','cancel','deny','challenge') NOT NULL DEFAULT 'pending',
  total_amount     DECIMAL(14,2) NOT NULL,
  shipping_cost    DECIMAL(12,2) NOT NULL DEFAULT 50000,
  shipping_address JSON          NOT NULL,
  notes            TEXT          DEFAULT NULL,
  created_at       DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id       (user_id),
  INDEX idx_order_number  (order_number),
  INDEX idx_status        (status),
  INDEX idx_payment_status(payment_status)
) ENGINE=InnoDB;

-- ─── ORDER ITEMS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT           NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL,
  price      DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order_id (order_id)
) ENGINE=InnoDB;

-- ─── PAYMENTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  order_id            INT          NOT NULL UNIQUE,
  snap_token          VARCHAR(500) DEFAULT NULL,
  midtrans_order_id   VARCHAR(100) DEFAULT NULL,
  transaction_id      VARCHAR(200) DEFAULT NULL,
  payment_type        VARCHAR(50)  DEFAULT NULL,
  status              ENUM('pending','settlement','expire','cancel','deny','challenge') NOT NULL DEFAULT 'pending',
  amount              DECIMAL(14,2) NOT NULL,
  paid_at             DATETIME     DEFAULT NULL,
  created_at          DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_midtrans_order_id (midtrans_order_id)
) ENGINE=InnoDB;

-- =====================================================
-- SEED DATA
-- =====================================================

-- Admin user (password: admin123)
INSERT INTO users (name, email, password, phone, role) VALUES
('Super Admin', 'admin@nilaprimafarm.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LjB8cLbH6UOe1CzBq', '081234567890', 'admin'),
('Demo User', 'user@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LjB8cLbH6UOe1CzBq', '082345678901', 'user');
-- Note: password hash above = 'admin123' / 'demo123' (same hash for demo)
-- For production, generate fresh hashes via bcrypt

-- Products seed
INSERT INTO products (name, category, size, price, stock, sold, description, image, tags, specs, rating, review_count, is_active) VALUES
(
  'Benih Nila Larasati F6',
  'Premium', '3-5 cm', 850, 50000, 12400,
  'Benih ikan nila Larasati F6 merupakan varietas unggul hasil seleksi genetik selama 6 generasi. Memiliki pertumbuhan cepat, tahan penyakit, dan adaptasi tinggi terhadap berbagai kondisi kolam.',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=450&fit=crop',
  '["best-seller","premium"]',
  '{"Ukuran":"3-5 cm","Berat":"0.5-1 gram/ekor","FCR":"1.2-1.4","Waktu Panen":"4-5 bulan","Survival Rate":">90%","Toleransi Suhu":"25-32°C"}',
  4.9, 234, 1
),
(
  'Benih Nila Gesit Plus',
  'Super Premium', '5-7 cm', 1200, 30000, 8750,
  'Benih nila Gesit Plus dikenal dengan pertumbuhan super cepat. Teknologi all-male monosex menjamin efisiensi produksi maksimal.',
  'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=450&fit=crop',
  '["new","super-premium"]',
  '{"Ukuran":"5-7 cm","Berat":"2-4 gram/ekor","FCR":"1.1-1.3","Waktu Panen":"3.5-4 bulan","Survival Rate":">92%","Toleransi Suhu":"24-33°C"}',
  4.8, 189, 1
),
(
  'Benih Nila Gift F5',
  'Standard', '2-3 cm', 550, 100000, 34200,
  'Benih nila Gift F5 adalah pilihan ekonomis dengan kualitas terjamin. Hasil hibridisasi dengan strain unggul GIFT dari WorldFish Center.',
  'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&h=450&fit=crop',
  '["popular","hemat"]',
  '{"Ukuran":"2-3 cm","Berat":"0.2-0.5 gram/ekor","FCR":"1.4-1.6","Waktu Panen":"5-6 bulan","Survival Rate":">88%","Toleransi Suhu":"23-34°C"}',
  4.7, 567, 1
),
(
  'Benih Nila Srikandi',
  'Super Premium', '5-8 cm', 1500, 15000, 4300,
  'Benih nila Srikandi adalah produk unggulan terbaru kami dengan teknologi genomik terkini.',
  'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=450&fit=crop',
  '["new","super-premium","best-growth"]',
  '{"Ukuran":"5-8 cm","Berat":"3-6 gram/ekor","FCR":"1.0-1.2","Waktu Panen":"3-3.5 bulan","Survival Rate":">95%","Toleransi Suhu":"24-34°C"}',
  4.9, 98, 1
),
(
  'Benih Nila Jatimbulan',
  'Premium', '3-5 cm', 750, 45000, 9800,
  'Benih nila Jatimbulan merupakan varietas lokal unggulan dari Jawa Timur. Dikenal adaptif terhadap kondisi air dengan salinitas rendah.',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=450&fit=crop',
  '["lokal","premium"]',
  '{"Ukuran":"3-5 cm","Berat":"0.5-1.2 gram/ekor","FCR":"1.3-1.5","Waktu Panen":"4-5 bulan","Survival Rate":">89%","Toleransi Suhu":"24-33°C"}',
  4.8, 145, 1
),
(
  'Benih Nila Merah Red',
  'Premium', '3-5 cm', 950, 25000, 7600,
  'Benih nila merah dengan penampilan menarik dan harga jual tinggi di pasaran. Sangat diminati untuk restoran dan pasar premium.',
  'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&h=450&fit=crop',
  '["premium","nila-merah"]',
  '{"Ukuran":"3-5 cm","Berat":"0.5-1 gram/ekor","FCR":"1.3-1.5","Waktu Panen":"4.5-5 bulan","Survival Rate":">90%","Toleransi Suhu":"25-32°C"}',
  4.7, 112, 1
);

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Run: mysql -u root -p < schema.sql
-- 2. Demo passwords: admin123 / demo123
-- 3. Generate fresh bcrypt hashes before production deployment
-- 4. Set up .env with correct credentials
