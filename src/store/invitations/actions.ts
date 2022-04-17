import { InvitationStatus, ResolveInvitationRequest } from 'src/contracts';
import { invitationService } from 'src/services';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { InvitationsStateInterface } from './state';

const actions: ActionTree<InvitationsStateInterface, StateInterface> = {
  async getUserInvitations({ commit }) {
    try {
      const invitations = await invitationService.getUserInvitations();

      commit('GET_USER_INVITATIONS', invitations);
    } catch (err) {
      throw err;
    }
  },

  async resolveInvitation(
    { commit },
    { id, status }: { id: string; status: InvitationStatus }
  ) {
    try {
      commit('SUBMIT_START');

      await invitationService.resolveInvitation(id, {
        status,
      } as ResolveInvitationRequest);

      commit('REMOVE_INVITATION', id);
    } catch (err) {
      throw err;
    } finally {
      commit('SUBMIT_FINISH');
    }
  },

  async getUserOptions({ commit }, search: string | undefined) {
    try {
      const response = await invitationService.getUserOptions({
        page: 1,
        limit: 10,
        search,
      });

      commit('GET_USER_OPTIONS', response.data);
    } catch (err) {
      throw err;
    }
  },
};

export default actions;
