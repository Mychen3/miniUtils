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

const createRiskDictSql = `
        CREATE TABLE risk_dict (
            risk_id INTEGER PRIMARY KEY AUTOINCREMENT,
            risk_status TEXT NOT NULL,
            risk_value TEXT NOT NULL
        )
    `;

const insertRiskDictSql = `
        INSERT INTO risk_dict (risk_status, risk_value)
        VALUES (?, ?)
    `;

const deleteRiskDictSql = `
        DELETE FROM risk_dict WHERE risk_id = ?
    `;

const insertUserSql = `
        INSERT INTO users (user_name, user_status, user_phone, user_tg_id, session_id)
        VALUES (?, ?, ?, ?, ?)
    `;

export { createUserSql, insertUserSql, createRiskDictSql, insertRiskDictSql, deleteRiskDictSql };
