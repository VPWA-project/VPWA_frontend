import { Invitation } from 'src/contracts';
import { MutationTree } from 'vuex';
import { InvitationsStateInterface } from './state';

const mutation: MutationTree<InvitationsStateInterface> = {
  ADD_INVITATION(state, invitation: Invitation) {
    state.invitations.push(invitation)
  },
  GET_USER_INVITATIONS(state, invitations: Invitation[]) {
    state.invitations = invitations
  }
};

export default mutation;
