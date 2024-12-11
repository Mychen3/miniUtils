import { IpcMainInvokeEvent } from 'electron';
import { GatherTime } from '../../common/const';
import { getUserById } from 'electron/db/module/user';
import { initClient } from './index';
const handleFlagMember = async (
  _event: IpcMainInvokeEvent,
  params: { groupId: string; flagNumber: number; flagTime: keyof typeof GatherTime; userId: number },
) => {
  try {
    const { groupId, flagNumber, flagTime, userId } = params;
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');
    const client = await initClient(user.session_id);
    if (!client) throw new Error('Client not found');
    const group = await client.getEntity(groupId);
    if (!group) throw new Error('Group not found');

  } catch (error) {
    console.error(error);
  }
};

export { handleFlagMember };
