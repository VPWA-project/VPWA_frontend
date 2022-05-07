import { Invitation, ServerError, User } from 'src/contracts';
import { MutationTree } from 'vuex';
import { InvitationsStateInterface } from './state';

const mutation: MutationTree<InvitationsStateInterface> = {
  SUBMIT_START(state) {
    state.isSubmitting = true
    state.error = null
  },
  SUBMIT_SUCCESS(state) {
    state.isSubmitting = false
  },
  SUBMIT_ERROR(state, error: ServerError) {
    state.isSubmitting = false
    state.error = error
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
  },
  GET_USER_OPTIONS(state, users: User[]) {
    state.userOptions = users
  }
};

export default mutation;
