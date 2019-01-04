DROP TABLE IF EXISTS users, friendships, chats, privat_chats;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profilpic TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    message_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE privat_chats (
    id SERIAL PRIMARY KEY,
    u_id INTEGER NOT NULL REFERENCES users(id),
    u2_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE chats_meta (
    id SERIAL PRIMARY KEY,
    pid INTEGER NOT NULL REFERENCES privat_chats(id),
    messages TEXT
);
