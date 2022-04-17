import { invitationService } from 'src/services';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { InvitationsStateInterface } from './state';

const actions: ActionTree<InvitationsStateInterface, StateInterface> = {
  async getUserInvitations({ commit }) {
    try {
      const invitations = await invitationService.getUserInvitations();

      commit('GET_USER_INVITATIONS', invitations)
    } catch (err) {
      throw err;
    }
  },
};

export default actions;
