import { insertUserSql } from '../sql';
import { db } from '../database';
import { IpcMainInvokeEvent } from 'electron';

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

const updateUserStatus = async (user_id: number, user_status: string) => {
  const stmt = db.prepare(`UPDATE users SET user_status = ? WHERE user_id = ?`);
  stmt.run(user_status, user_id);
};

const getPageUsers = async (
  _event: IpcMainInvokeEvent,
  params: { page?: number; pageSize?: number; phone?: string; userStatus?: string; isSession?: boolean },
) => {
  try {
    const { page = 1, pageSize = Number.MAX_SAFE_INTEGER, phone = '', userStatus, isSession = false } = params;
    // 计算 OFFSET 的起始位置
    const offset = (page - 1) * pageSize;

    // 根据 phone 和 userStatus 参数的值动态构建 SQL 查询
    let baseQuery = `FROM users`;
    const queryParams: (string | number)[] = [];

    if (phone.trim() !== '') {
      baseQuery += ` WHERE user_phone LIKE ?`;
      queryParams.push(`%${phone}%`);
    }

    if (userStatus) {
      baseQuery += phone.trim() !== '' ? ` AND user_status = ?` : ` WHERE user_status = ?`;
      queryParams.push(userStatus);
    }

    // 选择用户的 SQL 查询
    const selectUsersSql = `SELECT * ${baseQuery} LIMIT ? OFFSET ?`;
    // 计算总数的 SQL 查询，不包含 LIMIT 和 OFFSET
    const countUsersSql = `SELECT COUNT(*) as total ${baseQuery}`;

    const stmt = await db.prepare(selectUsersSql);
    const countStmt = await db.prepare(countUsersSql);

    // 添加 LIMIT 和 OFFSET 参数
    queryParams.push(pageSize, offset);

    const users = stmt.all(...queryParams);
    const totalResult = countStmt.get(...queryParams.slice(0, -2)); // 不传递 LIMIT 和 OFFSET 参数

    return {
      list: users.map((item) => {
        if (isSession) return item;
        const { session_id: _, ...rest } = item as IUserItem;
        return rest;
      }) as IUserItem[],
      total: (totalResult as { total: number }).total,
    };
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (_event: IpcMainInvokeEvent, userItem: IUserItem) => {
  try {
    const { user_id: userId } = userItem;
    const stmt = db.prepare(`DELETE FROM users WHERE user_id = ?`);
    await stmt.run(userId);
  } catch (error) {
    console.log(error);
  }
};

const getUsersByIds = (ids: number[], userStatus: string) => {
  const stmt = db.prepare(`SELECT * FROM users WHERE user_id IN (${ids.map(() => '?').join(',')}) AND user_status = ?`);
  return stmt.all(...ids, userStatus) as IUserItem[];
};

export { insertUser, getPageUsers, getAllUsers, deleteUser, getUserById, updateUserStatus, getUsersByIds };
