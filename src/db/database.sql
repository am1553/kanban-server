CREATE DATABASE kanbanboard;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();

CREATE TABLE users(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE boards(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL, 
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE columns(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE tasks(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR NOT NULL,
    description VARCHAR,
    column_id UUID REFERENCES columns(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE subtasks(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isCompleted BOOLEAN DEFAULT false,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL
);