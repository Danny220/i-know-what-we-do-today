DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS poll_options;
DROP TABLE IF EXISTS polls;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS events;

create table users (
	id UUID primary key default gen_random_uuid(),
	username VARCHAR(50) not null unique,
	email VARCHAR(255) not null unique,
	password_hash VARCHAR(255) not null,
	created_at TIMESTAMP with TIME zone default now()
);

create table groups (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(100) not null,
	description TEXT,
	created_by UUID not null references users(id), 
	created_at timestamp with TIME zone default NOW()
);

create table group_members (
	group_id UUID not null references groups(id) on delete cascade,
	user_id UUID not null references users(id) on delete cascade,
	role VARCHAR(20) not null default 'member',
	joined_at timestamp with time zone default now(),
	primary key (group_id, user_id)
);

create table activities (
	id uuid primary key default gen_random_uuid(),
	name varchar(100) not null unique 
);

create table locations (
	id uuid primary key default gen_random_uuid(),
	name varchar(100) not null,
	address TEXT
);

create table polls (
	id uuid primary key default gen_random_uuid(),
	title varchar(255) not null,
	description TEXT,
	status varchar(20) not null default 'open',
	group_id uuid not null references groups(id) on delete cascade,
	created_by uuid not null references users(id),
	created_at timestamp with time zone default now(),
	deadline timestamp with time zone
);

create table poll_options (
	id uuid primary key default gen_random_uuid(),
	poll_id uuid not null references polls(id) on delete cascade,
	type varchar(20) not null, 
	value text not null
);

CREATE TABLE votes(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (poll_option_id, user_id)
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location_id UUID REFERENCES locations(id),
    activity_id UUID REFERENCES activities(id),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE  CASCADE ,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);