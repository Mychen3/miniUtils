import Database from 'better-sqlite3';
import { createUserSql } from './sql';

let db: Database.Database;

const checkIfTableExists = (tableName: string) => {
  const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?");
  const row = stmt.get(tableName);
  return row !== undefined; // 如果表存在，返回 true
};

const initDb = (path: string) => {
  db = new Database(path, {});
  db.pragma('journal_mode = WAL');
  if (!checkIfTableExists('users')) db.exec(createUserSql);
};

const getDb = () => db;

const closeDb = () => {
  db.close();
};

export { initDb, closeDb, getDb };
