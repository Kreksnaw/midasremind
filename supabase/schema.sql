-- ============================================================
-- MidasRemind – Supabase Schema + Seed Data
-- Run this in the Supabase SQL Editor
-- ============================================================

-- customers
CREATE TABLE IF NOT EXISTS customers (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  phone         text        NOT NULL,
  email         text,
  vehicle_year  integer,
  vehicle_make  text,
  vehicle_model text,
  last_service_date  date,
  last_service_type  text,
  next_service_due   date,
  mileage       integer     DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- reminders
CREATE TABLE IF NOT EXISTS reminders (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid        REFERENCES customers(id) ON DELETE SET NULL,
  customer_name text        NOT NULL,
  service_type  text        NOT NULL,
  due_date      date        NOT NULL,
  status        text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','opened')),
  sent_at       date,
  phone         text,
  created_at    timestamptz DEFAULT now()
);

-- promotions
CREATE TABLE IF NOT EXISTS promotions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  discount_type   text        NOT NULL DEFAULT 'amount' CHECK (discount_type IN ('amount','percent','free')),
  discount_value  text,
  expiration_date date        NOT NULL,
  message         text        NOT NULL,
  customers_sent  integer     DEFAULT 0,
  status          text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired')),
  created_at      timestamptz DEFAULT now()
);

-- shop_settings (single row, id = 1)
CREATE TABLE IF NOT EXISTS shop_settings (
  id              integer     PRIMARY KEY DEFAULT 1,
  name            text,
  phone           text,
  address         text,
  city            text,
  state           text,
  zip             text,
  sms_sender_name text,
  hours           jsonb
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Customers
INSERT INTO customers (name, phone, email, vehicle_year, vehicle_make, vehicle_model, last_service_date, last_service_type, next_service_due, mileage) VALUES
  ('James Nguyen',       '(408) 555-0182', 'jnguyen@gmail.com',       2019, 'Toyota',    'Camry',    '2026-01-14', 'Oil Change',                '2026-04-14', 47200),
  ('Maria Gonzalez',     '(408) 555-0247', 'mariag@yahoo.com',         2021, 'Honda',     'CR-V',     '2026-02-03', 'Brake Inspection',          '2026-08-03', 28900),
  ('David Kim',          '(408) 555-0391', 'dkim@outlook.com',         2017, 'Ford',      'F-150',    '2026-01-28', 'Tire Rotation',             '2026-04-28', 83400),
  ('Sarah Patel',        '(408) 555-0514', 'sarah.patel@gmail.com',    2022, 'Tesla',     'Model 3',  '2026-02-20', 'Tire Rotation',             '2026-05-20', 15600),
  ('Robert Chen',        '(408) 555-0673', 'rchen@gmail.com',          2018, 'BMW',       'X5',       '2025-12-10', 'Full Synthetic Oil Change', '2026-03-10', 62100),
  ('Linda Torres',       '(408) 555-0728', 'ltorres@icloud.com',       2020, 'Chevrolet', 'Equinox',  '2026-01-05', 'Air Filter Replacement',    '2026-07-05', 39800),
  ('Michael Washington', '(408) 555-0834', 'mwash@gmail.com',          2016, 'Nissan',    'Altima',   '2026-02-14', 'Oil Change + Filter',       '2026-05-14', 91200),
  ('Amy Tanaka',         '(408) 555-0965', 'atanaka@yahoo.com',        2023, 'Subaru',    'Outback',  '2026-03-01', 'Multi-Point Inspection',    '2026-09-01',  8400),
  ('Carlos Rivera',      '(408) 555-0143', 'crivera@gmail.com',        2015, 'Jeep',      'Wrangler', '2025-11-22', 'Brake Pads & Rotors',       '2026-05-22',105600),
  ('Jennifer Wu',        '(408) 555-0276', 'jwu@gmail.com',            2020, 'Hyundai',   'Tucson',   '2026-02-28', 'Oil Change',                '2026-05-28', 33100)
ON CONFLICT DO NOTHING;

-- Reminders (using customer names to cross-reference; ids will be auto-generated)
-- We insert reminders after customers so we can reference by name
INSERT INTO reminders (customer_id, customer_name, service_type, due_date, status, sent_at, phone)
SELECT c.id, 'Robert Chen', 'Full Synthetic Oil Change', '2026-03-10', 'sent', '2026-03-03', '(408) 555-0673'
FROM customers c WHERE c.name = 'Robert Chen' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO reminders (customer_id, customer_name, service_type, due_date, status, phone)
SELECT c.id, 'James Nguyen', 'Oil Change', '2026-04-14', 'pending', '(408) 555-0182'
FROM customers c WHERE c.name = 'James Nguyen' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO reminders (customer_id, customer_name, service_type, due_date, status, phone)
SELECT c.id, 'David Kim', 'Tire Rotation', '2026-04-28', 'pending', '(408) 555-0391'
FROM customers c WHERE c.name = 'David Kim' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO reminders (customer_id, customer_name, service_type, due_date, status, sent_at, phone)
SELECT c.id, 'Michael Washington', 'Oil Change + Filter', '2026-05-14', 'opened', '2026-03-10', '(408) 555-0834'
FROM customers c WHERE c.name = 'Michael Washington' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO reminders (customer_id, customer_name, service_type, due_date, status, phone)
SELECT c.id, 'Sarah Patel', 'Tire Rotation', '2026-05-20', 'pending', '(408) 555-0514'
FROM customers c WHERE c.name = 'Sarah Patel' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO reminders (customer_id, customer_name, service_type, due_date, status, phone)
SELECT c.id, 'Jennifer Wu', 'Oil Change', '2026-05-28', 'pending', '(408) 555-0276'
FROM customers c WHERE c.name = 'Jennifer Wu' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO reminders (customer_id, customer_name, service_type, due_date, status, sent_at, phone)
SELECT c.id, 'Carlos Rivera', 'Brake Inspection', '2026-05-22', 'sent', '2026-03-15', '(408) 555-0143'
FROM customers c WHERE c.name = 'Carlos Rivera' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO reminders (customer_id, customer_name, service_type, due_date, status, phone)
SELECT c.id, 'Maria Gonzalez', 'Brake Inspection Follow-up', '2026-08-03', 'pending', '(408) 555-0247'
FROM customers c WHERE c.name = 'Maria Gonzalez' LIMIT 1
ON CONFLICT DO NOTHING;

-- Promotions
INSERT INTO promotions (title, discount_type, discount_value, expiration_date, message, customers_sent, status, created_at) VALUES
  ('Spring Oil Change Special',        'amount',  '10',            '2026-04-30', 'Spring into savings! Get $10 off your next oil change at Midas Sunnyvale. Show this text at checkout. Exp. 4/30/26.',                               87,  'active',  '2026-03-01'),
  ('Free Tire Rotation with Oil Change','free',    'tire rotation', '2026-03-31', 'Get a FREE tire rotation with any oil change this month at Midas Sunnyvale! Call (408) 498-7075. Exp. 3/31/26.',                                  143, 'active',  '2026-03-01'),
  ('Brake Inspection Special',          'free',    'inspection',    '2026-02-28', 'FREE brake inspection at Midas Sunnyvale. Don''t wait — your safety matters. Book now at (408) 498-7075. Exp. 2/28/26.',                           201, 'expired', '2026-02-01'),
  ('New Year Tune-Up Deal',             'percent', '15',            '2026-01-31', 'Start 2026 right! 15% off a full tune-up at Midas Sunnyvale. Mention this text to redeem. Exp. 1/31/26.',                                          118, 'expired', '2026-01-02')
ON CONFLICT DO NOTHING;

-- Shop Settings
INSERT INTO shop_settings (id, name, phone, address, city, state, zip, sms_sender_name, hours) VALUES (
  1,
  'Midas Sunnyvale',
  '(408) 498-7075',
  '725 E El Camino Real',
  'Sunnyvale',
  'CA',
  '94087',
  'MidasSunnyvale',
  '{
    "monday":    "7:30 AM – 6:00 PM",
    "tuesday":   "7:30 AM – 6:00 PM",
    "wednesday": "7:30 AM – 6:00 PM",
    "thursday":  "7:30 AM – 6:00 PM",
    "friday":    "7:30 AM – 6:00 PM",
    "saturday":  "7:30 AM – 5:00 PM",
    "sunday":    "Closed"
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
