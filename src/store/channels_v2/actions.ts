import { Channel, RawMessage } from 'src/contracts';
import { channelService } from 'src/services';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsV2StateInterface } from './state';

const actions: ActionTree<ChannelsV2StateInterface, StateInterface> = {
  async join({ commit }, channel: string) {
    try {
      commit('LOADING_START');

      const response = await channelService.join(channel).loadMessages();

      commit('LOADING_SUCCESS', {
        channel,
        messages: response.data,
        page: response.meta,
      });
    } catch (err) {
      commit('LOADING_ERROR', err);
      throw err;
    }
  },

  async fetchMessages(
    { commit },
    { channel, page, limit }: { channel: string; page: number; limit: number }
  ) {
    try {
      const response = await channelService.in(channel)?.loadMessages(page, limit);

      console.log('Fetching new messages: ', response)

      commit('FETCH_MESSAGES', {
        channel,
        messages: response?.data,
        page: response?.meta,
      });
    } catch (err) {
      throw err;
    }
  },

  leave({ getters, commit }, channel: string | null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const leaving: string[] =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      channel !== null ? [channel] : getters.joinedChannels;

    leaving.forEach((c) => {
      channelService.leave(c);
      commit('CLEAR_CHANNEL', c);
    });
  },

  async addMessage(
    { commit },
    { channel, message }: { channel: string; message: RawMessage }
  ) {
    try {
      const newMessage = await channelService.in(channel)?.addMessage(message);
      commit('NEW_MESSAGE', { channel, message: newMessage });
    } catch (err) {
      throw err;
    }
  },

  async getUserChannels({ commit }) {
    try {
      commit('LOADING_START');

      const channels = await channelService.getUserChannels();

      commit('GET_USER_CHANNELS', channels);
    } catch (err) {
      commit('LOADING_ERROR');
      throw err;
    }
  },

  async setActiveChannel(
    { getters, commit, dispatch },
    name: string | undefined
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const activeChannel = getters['getActiveChannel'] as Channel | null;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const channels = getters['getUserChannels'] as Channel[];

      const channel = channels.find((channel) => channel.name === name);

      await dispatch('leave', activeChannel?.name);
      if (name) await dispatch('join', name);

      commit('SET_ACTIVE', channel);
    } catch (err) {
      await dispatch('leave', name);
      throw err;
    }
  },
};

export default actions;
