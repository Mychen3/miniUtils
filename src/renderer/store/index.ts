import { create } from 'zustand';
import { createInviteMember, IInviteMember } from './module/inviteMember';
import { createGather, IGather } from './module/gather';

const useStore = create<IInviteMember & IGather>()((...params) => ({
  ...createInviteMember(...params),
  ...createGather(...params),
}));

export default useStore;
