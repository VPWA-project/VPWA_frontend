import { Invitation } from 'src/contracts';
import { MutationTree } from 'vuex';
import { InvitationsStateInterface } from './state';

const mutation: MutationTree<InvitationsStateInterface> = {
  SUBMIT_START(state) {
    state.isSubmitting = true
    state.errors = null
  },
  SUBMIT_FINISH(state) {
    state.isSubmitting = false
  },
  ADD_INVITATION(state, invitation: Invitation) {
    state.invitations.push(invitation)
  },
  REMOVE_INVITATION(state, id: string) {
    const invitation = state.invitations.find(invitation => invitation.id === id)
    
    state.invitations = state.invitations.filter(i => i !== invitation)
  },
  GET_USER_INVITATIONS(state, invitations: Invitation[]) {
    state.invitations = invitations
  }
};

export default mutation;
