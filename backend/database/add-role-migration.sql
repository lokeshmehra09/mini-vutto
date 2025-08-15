-- Migration script to add role column to existing users table
-- Run this script if you have an existing database without the role column

-- Add role column with default value
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Update existing users to have 'user' role if they don't have one
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Make role column NOT NULL after setting default values
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
