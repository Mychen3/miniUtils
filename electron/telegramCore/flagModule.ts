import { IpcMainInvokeEvent, BrowserWindow, dialog, IpcMainEvent } from 'electron';
import { GatherTime } from '../../common/const';
import { getUserById } from '../db/module/user';
import { initClient } from './index';
import { IpcKey } from '../ipc/ipcKey.ts';
import { TelegramClient } from 'telegram';
import fs from 'fs';

let speakerIdList: Array<string> = [];
let isStop = false;

const getHours = (flagTime: GatherTime) => {
  const hours = {
    [GatherTime.day]: 24,
    [GatherTime.threeDay]: 72,
    [GatherTime.monday]: 168,
  }[flagTime];
  return hours;
};

const handleFlagMemberTellStop = () => {
  isStop = true;
};

const exportFlagMember = (_event: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(_event.sender);
  dialog
    .showSaveDialog({
      title: '另存为',
      defaultPath: 'output.txt',
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })
    .then((result) => {
      if (!result.canceled) {
        const dataString = speakerIdList.join('\n');
        // 如果用户没有取消，写入文件
        fs.writeFile(result.filePath, dataString, (err) => {
          if (err) {
            console.error('写入文件时出错:', err);
            win?.webContents.send(IpcKey.onToastMessage, '文件导出失败', 'error');
          } else {
            console.log('文件已成功导出为', result.filePath);
            win?.webContents.send(IpcKey.onToastMessage, '文件导出成功', 'success');
          }
        });
      }
    })
    .catch((err) => {
      console.error('打开保存对话框时出错:', err);
      win?.webContents.send(IpcKey.onToastMessage, '文件导出失败', 'error');
    });
};

const getFlagTellInfo = async (userId: number, groupId: string) => {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error('用户Id不存在');
    const client = await initClient(user.session_id);
    if (!client) throw new Error('客户端初始化失败');
    const groupEntity = await client.getEntity(groupId);
    if (!groupEntity) throw new Error('群不存在');
    const participants = await client.getParticipants(groupEntity);
    if (!participants) throw new Error('获取群组管理员失败');
    const adminList = Array.from(participants.values()).map((item) => item.username) as string[];
    return {
      client,
      adminList,
      groupEntity,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const handleFlagMemberTell = async (
  _event: IpcMainInvokeEvent,
  params: { groupId: string; flagNumber: number; flagTime: GatherTime; userId: number },
) => {
  const win = BrowserWindow.fromWebContents(_event.sender);
  isStop = false;
  speakerIdList = [];
  let clientGlobal: TelegramClient | null = null;
  try {
    const { groupId, flagNumber, flagTime, userId } = params;
    const now = new Date();
    const timeAgo = new Date(now.getTime() - getHours(flagTime) * 60 * 60 * 1000);
    const result = await getFlagTellInfo(userId, groupId)!;
    if (!result) throw new Error('获取群组信息失败');
    const { client, adminList, groupEntity } = result;
    if (!client || !groupEntity) throw new Error('客户端或群组实体不存在');
    clientGlobal = client;
    const speakerIds = new Set();
    let offset = 0;
    const limit = 200;
    let reachedTimeLimit = false;

    while (speakerIds.size < flagNumber && !reachedTimeLimit) {
      if (isStop) break;
      const messages = await client.getMessages(groupEntity, {
        limit: limit,
        addOffset: offset,
      });

      // 如果没有更多消息，退出循环
      if (messages.length === 0) break;

      for (const message of messages) {
        // 如果消息时间超出范围，标记时间限制并退出循环
        if (message.date < Math.floor(timeAgo.getTime() / 1000)) {
          reachedTimeLimit = true;
          break;
        }
        // 获取实际发言的用户ID，并确保转换为字符串
        const userName = (message?.sender as { username: string })?.username;
        if (userName && !adminList.includes(userName)) speakerIds.add(`@${userName}`);
        // 达到最大收集数量，退出循环
        if (speakerIds.size >= flagNumber) break;
      }
      // 如果达到最大收集数量或时间限制，退出外层循环
      if (speakerIds.size >= flagNumber || reachedTimeLimit) break;

      // 增加偏移量，获取下一批消息
      offset += limit;

      win?.webContents.send(IpcKey.onFlagMemberInfo, {
        successNumber: speakerIds.size,
        type: 'success',
      });
      await new Promise((resolve) => setTimeout(resolve, 20000));
    }
    await client.destroy();
    const speakerIdsArray = Array.from(speakerIds).slice(0, flagNumber);
    speakerIdList = speakerIdsArray as Array<string>;
    win?.webContents.send(IpcKey.onFlagMemberInfo, {
      successNumber: speakerIdsArray.length,
      type: 'end',
      message: '采集完成',
    });
  } catch (error) {
    if (clientGlobal) await clientGlobal.destroy();
    win?.webContents.send(IpcKey.onFlagMemberInfo, {
      type: 'error',
      message: `采集失败：${error}`,
    });
    console.error(error);
  }
};

export { handleFlagMemberTell, handleFlagMemberTellStop, exportFlagMember };
