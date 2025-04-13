-- Migration: Initial Schema for 10xCards
-- Description: Creates the core tables (generations, flashcards, generations_error_logs) with proper constraints,
-- indexes, and Row Level Security (RLS) policies.
-- Author: AI Assistant
-- Date: 2024-03-19

-- Enable Row Level Security
alter table if exists generations disable row level security;
alter table if exists flashcards disable row level security;
alter table if exists generations_error_logs disable row level security;

-- Drop existing tables if they exist (in correct order due to foreign keys)
drop table if exists flashcards;
drop table if exists generations_error_logs;
drop table if exists generations;

-- Create generations table
create table generations (
    id serial primary key,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    source_text_hash varchar not null,
    model text not null,
    generated_count integer not null,
    accepted_count_without_edit integer,
    accepted_count_with_edit integer,
    generation_duration integer not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    user_id uuid references auth.users(id) on delete cascade
);

-- Create indexes for generations
create index generations_created_at_idx on generations(created_at);
create index generations_user_id_idx on generations(user_id);

-- Create flashcards table
create table flashcards (
    id serial primary key,
    front varchar(200) not null,
    back varchar(500) not null,
    source varchar(20) not null check (source in ('ai-full', 'ai-edited', 'manual')),
    generation_id integer references generations(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

-- Create indexes for flashcards
create index flashcards_user_id_idx on flashcards(user_id);
create index flashcards_generation_id_idx on flashcards(generation_id);
create index flashcards_created_at_idx on flashcards(created_at);

-- Create generations_error_logs table
create table generations_error_logs (
    id serial primary key,
    error_message varchar(1000) not null,
    error_code varchar(100) not null,
    created_at timestamp not null default current_timestamp,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    source_text_hash varchar not null,
    model text not null,
    user_id uuid references auth.users(id)
);

-- Create updated_at triggers
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

create trigger update_generations_updated_at
    before update on generations
    for each row
    execute function update_updated_at_column();

create trigger update_flashcards_updated_at
    before update on flashcards
    for each row
    execute function update_updated_at_column();

-- Enable Row Level Security
alter table generations enable row level security;
alter table flashcards enable row level security;
alter table generations_error_logs enable row level security;

-- RLS Policies for generations
create policy "Allow users to select their own generations"
    on generations for select
    to authenticated
    using (user_id = auth.uid());

create policy "Allow users to insert their own generations"
    on generations for insert
    to authenticated
    with check (user_id = auth.uid());

create policy "Allow users to update their own generations"
    on generations for update
    to authenticated
    using (user_id = auth.uid());

create policy "Allow users to delete their own generations"
    on generations for delete
    to authenticated
    using (user_id = auth.uid());

-- RLS Policies for flashcards
create policy "Allow users to select their own flashcards"
    on flashcards for select
    to authenticated
    using (user_id = auth.uid());

create policy "Allow users to insert their own flashcards"
    on flashcards for insert
    to authenticated
    with check (user_id = auth.uid());

create policy "Allow users to update their own flashcards"
    on flashcards for update
    to authenticated
    using (user_id = auth.uid());

create policy "Allow users to delete their own flashcards"
    on flashcards for delete
    to authenticated
    using (user_id = auth.uid());

-- RLS Policies for generations_error_logs
create policy "Allow users to select their own error logs"
    on generations_error_logs for select
    to authenticated
    using (user_id = auth.uid());

create policy "Allow users to insert their own error logs"
    on generations_error_logs for insert
    to authenticated
    with check (user_id = auth.uid());

-- Note: Update and Delete operations are not allowed on error logs 