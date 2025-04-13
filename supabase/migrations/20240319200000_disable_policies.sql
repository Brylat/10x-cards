-- Migration: Disable RLS Policies
-- Description: Disables all Row Level Security (RLS) policies from generations, flashcards, and generations_error_logs tables
-- Author: AI Assistant
-- Date: 2024-03-19

-- Drop policies from generations table
drop policy if exists "Allow users to select their own generations" on generations;
drop policy if exists "Allow users to insert their own generations" on generations;
drop policy if exists "Allow users to update their own generations" on generations;
drop policy if exists "Allow users to delete their own generations" on generations;

-- Drop policies from flashcards table
drop policy if exists "Allow users to select their own flashcards" on flashcards;
drop policy if exists "Allow users to insert their own flashcards" on flashcards;
drop policy if exists "Allow users to update their own flashcards" on flashcards;
drop policy if exists "Allow users to delete their own flashcards" on flashcards;

-- Drop policies from generations_error_logs table
drop policy if exists "Allow users to select their own error logs" on generations_error_logs;
drop policy if exists "Allow users to insert their own error logs" on generations_error_logs;

-- Disable RLS on all tables
alter table if exists generations disable row level security;
alter table if exists flashcards disable row level security;
alter table if exists generations_error_logs disable row level security; 