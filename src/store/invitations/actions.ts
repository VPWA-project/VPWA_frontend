import { AxiosError } from 'axios';
import {
  Channel,
  CreateInvitationRequest,
  InvitationStatus,
  ResolveInvitationRequest,
} from 'src/contracts';
import { invitationManager, invitationService } from 'src/services';
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
    { commit, dispatch },
    {
      id,
      status,
      channel,
    }: { id: string; status: InvitationStatus; channel: Channel }
  ) {
    try {
      commit('SUBMIT_START');

      await invitationService.resolveInvitation(id, {
        status,
      } as ResolveInvitationRequest);

      commit('REMOVE_INVITATION', id);

      if (status === 'ACCEPT')
        await dispatch('channels_v2/addChannel', channel, { root: true });

      commit('SUBMIT_SUCCESS');
    } catch (err) {
      const error = err as AxiosError;

      commit('SUBMIT_ERROR', { message: error.message });
      throw err;
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

  async getChannelUserOptions(
    { commit },
    { channelId, search }: { channelId: string; search: string | undefined }
  ) {
    try {
      const response = await invitationService.getChannelUserOptions(
        channelId,
        { page: 1, limit: 10, search }
      );

      commit('GET_USER_OPTIONS', response.data);
    } catch (err) {
      throw err;
    }
  },

  async invite(
    { commit },
    { channelId, userIds }: { channelId: string; userIds: string[] }
  ) {
    try {
      commit('SUBMIT_START');

      await Promise.all(
        userIds.map((userId) =>
          invitationManager.sendInvitation({
            channelId,
            userId,
          } as CreateInvitationRequest)
        )
      );

      commit('SUBMIT_SUCCESS');
    } catch (err) {
      const error = err as AxiosError;

      commit('SUBMIT_ERROR', { message: error.message });
      throw err;
    }
  },

  async inviteByNickname(
    { commit },
    { channelId, nicknames }: { channelId: string; nicknames: string[] }
  ) {
    try {
      commit('SUBMIT_START');

      await Promise.all(
        nicknames.map((nickname) =>
          invitationManager.sendInvitation({
            channelId,
            nickname,
          } as CreateInvitationRequest)
        )
      );
      
      commit('SUBMIT_SUCCESS');
    } catch (err) {
      const error = err as AxiosError;

      commit('SUBMIT_ERROR', { message: error.message });
      throw err;
    }
  },
};

export default actions;
