import { insertUserSql } from '../sql';
import { db } from '../database';
import { IpcMainInvokeEvent } from 'electron';
import { clients } from '../../telegramCore/index';

interface InsertUserParams {
  userName: string;
  userStatus: string;
  userTgId: string;
  sessionId: string;
  userPhone: string;
}

export interface IUserItem {
  user_id: number;
  user_name: string;
  user_status: string;
  user_phone: string;
  user_tg_id: string;
  user_avatar: string;
  session_id: string;
}

const insertUser = (params: InsertUserParams) => {
  const stmt = db.prepare(insertUserSql);
  stmt.run(params.userName, params.userStatus, params.userPhone, params.userTgId, params.sessionId);
};

const getAllUsers = () => {
  const stmt = db.prepare(`SELECT * FROM users`);
  return stmt.all();
};

const getUserById = (user_id: number) => {
  const stmt = db.prepare(`SELECT * FROM users WHERE user_id = ?`);
  return stmt.get(user_id) as IUserItem;
};

const updateUserStatus = (user_id: number, user_status: string) => {
  const stmt = db.prepare(`UPDATE users SET user_status = ? WHERE user_id = ?`);
  stmt.run(user_status, user_id);
};

const getPageUsers = async (_event: IpcMainInvokeEvent, params: { page: number; pageSize: number; search: string }) => {
  try {
    const { page, pageSize, search } = params;
    // 计算 OFFSET 的起始位置
    const offset = (page - 1) * pageSize;

    // 根据 search 参数的值动态构建 SQL 查询
    let baseQuery = `FROM users`;
    if (search.trim() !== '') baseQuery += ` WHERE user_name LIKE ?`;
    const selectUsersSql = `SELECT * ${baseQuery} LIMIT ? OFFSET ?`;
    const countUsersSql = `SELECT COUNT(*) as total ${baseQuery}`;

    const stmt = await db.prepare(selectUsersSql);
    const countStmt = await db.prepare(countUsersSql);

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
      list: users.map((item) => {
        const { session_id: _, ...rest } = item as IUserItem;
        return rest;
      }),
      total: (totalResult as { total: number }).total,
    };
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (_event: IpcMainInvokeEvent, userItem: IUserItem) => {
  try {
    const { user_id: userId, user_phone } = userItem;
    const stmt = db.prepare(`DELETE FROM users WHERE user_id = ?`);
    await stmt.run(userId);
    const client = clients.get(userItem.session_id);
    if (client) {
      client.destroy();
      clients.delete(user_phone);
    }
  } catch (error) {
    console.log(error);
  }
};

export { insertUser, getPageUsers, getAllUsers, deleteUser, getUserById, updateUserStatus };
