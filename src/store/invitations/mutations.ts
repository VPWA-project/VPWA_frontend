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
    state.invitations[invitation.channel.name] = invitation
  },
  REMOVE_INVITATION(state, channel: string) {
    if(channel in state.invitations) delete state.invitations[channel];
  },
  GET_USER_INVITATIONS(state, invitations: Invitation[]) {
    invitations.forEach(invitation => {
      state.invitations[invitation.channel.name] = invitation
    })
  },
  GET_USER_OPTIONS(state, users: User[]) {
    state.userOptions = users
  }
};

export default mutation;
