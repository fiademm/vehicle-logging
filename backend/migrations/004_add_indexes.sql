-- Add indexes to frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_vehicle_logs_vehicle_type_id ON vehicle_logs(vehicle_type_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_logs_entry_time ON vehicle_logs(entry_time);
CREATE INDEX IF NOT EXISTS idx_vehicle_logs_exit_time ON vehicle_logs(exit_time);
CREATE INDEX IF NOT EXISTS idx_vehicle_logs_logged_by ON vehicle_logs(logged_by);