import { IpcMainInvokeEvent } from 'electron';
import { GatherTime } from '../../common/const';

const handleFlagMember = async (
  _event: IpcMainInvokeEvent,
  params: { groupId: string; flagNumber: number; flagTime: keyof typeof GatherTime },
) => {};

export { handleFlagMember };
