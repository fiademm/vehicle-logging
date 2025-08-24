CREATE TABLE IF NOT EXISTS vehicle_logs (
  id SERIAL PRIMARY KEY,
  vehicle_type_id INTEGER REFERENCES vehicle_types(id),
  entry_time TIMESTAMP NOT NULL,
  exit_time TIMESTAMP,
  logged_by INTEGER REFERENCES users(id),
  license_plate VARCHAR(20),
  notes TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);