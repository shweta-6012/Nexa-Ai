import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "nexaai.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():

    with get_connection() as connection:

        # Existing chat history table
        connection.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_message TEXT NOT NULL,
                ai_response TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # NEW: Users table
        connection.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)


def save_chat(user_message, ai_response):

    with get_connection() as connection:

        connection.execute("""
            INSERT INTO chat_history (user_message, ai_response)
            VALUES (?, ?)
        """, (user_message, ai_response))


def get_chat_history():

    with get_connection() as connection:

        cursor = connection.execute("""
            SELECT id, user_message, ai_response, created_at
            FROM chat_history
            ORDER BY id ASC
        """)

        return [dict(row) for row in cursor.fetchall()]


# NEW: Register user
def register_user(name, email, password):

    try:

        with get_connection() as connection:

            connection.execute("""
                INSERT INTO users (name, email, password)
                VALUES (?, ?, ?)
            """, (name, email, password))

        return True

    except sqlite3.IntegrityError:
        return False


# NEW: Check login
def login_user(email, password):

    with get_connection() as connection:

        cursor = connection.execute("""
            SELECT id, name, email
            FROM users
            WHERE email = ? AND password = ?
        """, (email, password))

        user = cursor.fetchone()

        if user:
            return dict(user)

        return None