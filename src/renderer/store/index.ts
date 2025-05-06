import { create } from 'zustand';
import { createInviteMember, IInviteMember } from './module/inviteMember';
import { createGather, IGather } from './module/gather';
import { createCommon, ICommon } from './module/common';
const useStore = create<IInviteMember & IGather & ICommon>()((...params) => ({
  ...createInviteMember(...params),
  ...createGather(...params),
  ...createCommon(...params),
}));

export default useStore;
