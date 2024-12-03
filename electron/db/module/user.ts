import Database from 'better-sqlite3';
import { insertUserSql } from '../sql';

interface InsertUserParams {
  userName: string;
  userStatus: string;
  userAvatar: string;
  userTgId: string;
  sessionId: string;
  userPhone: string;
}

const insertUser = (db: Database.Database, params: InsertUserParams) => () => {
  const stmt = db.prepare(insertUserSql);
  stmt.run(params.userName, params.userStatus, params.userPhone, params.userAvatar, params.userTgId, params.sessionId);
};

const getPageUsers = (db: Database.Database, params: { page: number; pageSize: number; search: string }) => {
  const { page, pageSize, search } = params;
  // 计算 OFFSET 的起始位置
  const offset = (page - 1) * pageSize;

  // 根据 search 参数的值动态构建 SQL 查询
  let baseQuery = `FROM users`;
  if (search.trim() !== '') baseQuery += ` WHERE user_name LIKE ?`;
  const selectUsersSql = `SELECT * ${baseQuery} LIMIT ? OFFSET ?`;
  const countUsersSql = `SELECT COUNT(*) as total ${baseQuery}`;

  const stmt = db.prepare(selectUsersSql);
  const countStmt = db.prepare(countUsersSql);

  // 根据是否有搜索关键字传入不同的参数
  let users, totalResult;
  if (search.trim() !== '') {
    users = stmt.all(`%${search}%`, pageSize, offset);
    totalResult = countStmt.get(`%${search}%`);
  } else {
    users = stmt.all(pageSize, offset);
    totalResult = countStmt.get();
  }

  return {
    list: users,
    total: (totalResult as { total: number }).total,
  };
};

export { insertUser, getPageUsers };
