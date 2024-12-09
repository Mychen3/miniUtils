import { create } from 'zustand';
import { createInviteMember, IInviteMember } from './module/inviteMember';

const useStore = create<IInviteMember>()((...params) => ({
  ...createInviteMember(...params),
}));

export default useStore;
