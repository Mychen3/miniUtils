const createUserSql = `
        CREATE TABLE users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            user_status TEXT NOT NULL,
            user_phone TEXT,
            user_avatar TEXT,
            user_tg_id TEXT,
            session_id TEXT
        )
    `;
const insertUserSql = `
        INSERT INTO users (user_name, user_status, user_phone, user_tg_id, session_id)
        VALUES (?, ?, ?, ?, ?)
    `;

export { createUserSql, insertUserSql };
