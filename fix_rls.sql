-- Fix Row Level Security for the records table
-- This script will allow anonymous users (using the anon key) to perform CRUD operations.
-- Run this in the Supabase SQL Editor (https://app.supabase.com/project/agtoknvwtfipcumxvcrj/sql)

-- Option 1: Disable RLS entirely (simplest)
ALTER TABLE records DISABLE ROW LEVEL SECURITY;

-- Option 2: Keep RLS but add permissive policies (if you prefer to keep RLS enabled)
-- First, drop any existing policies (optional)
DROP POLICY IF EXISTS "Allow all for anon" ON records;
-- Create a policy that allows all operations for anon users
CREATE POLICY "Allow all for anon" ON records FOR ALL USING (true) WITH CHECK (true);

-- Verify that RLS is configured correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'records';