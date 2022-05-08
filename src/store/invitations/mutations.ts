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
    state.invitations[invitation.id] = invitation
  },
  REMOVE_INVITATION(state, id: string) {
    if(id in state.invitations) delete state.invitations[id]
  },
  GET_USER_INVITATIONS(state, invitations: Invitation[]) {
    invitations.forEach(invitation => {
      state.invitations[invitation.id] = invitation
    })
  },
  GET_USER_OPTIONS(state, users: User[]) {
    state.userOptions = users
  }
};

export default mutation;
