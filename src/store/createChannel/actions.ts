import { AxiosError } from 'axios';
import {
  CreateChannelRequest,
  CreateInvitationRequest,
  ValidationErrorResponse,
} from 'src/contracts';
import { channelService, invitationManager } from 'src/services';
import { ActionTree } from 'vuex';
import { ChannelType } from '../channels/state';
import { StateInterface } from '../index';
import { CreateChannelStateInterface } from './state';

const actions: ActionTree<CreateChannelStateInterface, StateInterface> = {
  async create(
    { commit },
    {
      name,
      type,
      invitations,
    }: { name: string; type: ChannelType; invitations?: string[] }
  ) {
    try {
      commit('SUBMIT_START');

      const channel = await channelService.create({
        name,
        type,
      } as CreateChannelRequest);

      invitations?.forEach((userId) => {
        void invitationManager.sendInvitation({
          channelId: channel.id,
          userId,
        } as CreateInvitationRequest);
      });

      commit('SUBMIT_SUCCESS', channel);
      commit('channels_v2/ADD_CHANNEL', channel, { root: true });
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 422) {
        const errors = error.response.data as ValidationErrorResponse;
        commit('SUBMIT_ERROR', errors.errors);
      }

      throw err;
    }
  },
};

export default actions;
