-- Add new profile fields
ALTER TABLE profiles
ADD COLUMN name text,
ADD COLUMN avatar_url text,
ADD COLUMN bio text,
ADD COLUMN phone_number text;
