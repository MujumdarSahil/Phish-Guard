/*
  # Initial Database Schema for PhishGuard

  1. New Tables
    - `profiles` - Stores user profile information
      - `id` (uuid, primary key) - Matches the auth.users id
      - `created_at` (timestamptz)
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `preferences` (jsonb)
    - `scan_history` - Records of URL scans
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key to profiles)
      - `url` (text)
      - `is_phishing` (boolean)
      - `confidence_score` (float)
      - `model_used` (text)
      - `features` (jsonb)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  preferences jsonb
);

-- Create scan history table
CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  is_phishing boolean NOT NULL,
  confidence_score float NOT NULL,
  model_used text NOT NULL,
  features jsonb
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for scan history
CREATE POLICY "Users can view their own scan history"
  ON scan_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert scan history"
  ON scan_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scan history"
  ON scan_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create index for performance
CREATE INDEX idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX idx_scan_history_created_at ON scan_history(created_at);
CREATE INDEX idx_scan_history_is_phishing ON scan_history(is_phishing);