import {
  Channel,
  KickType,
  KickUserRequest,
  RawMessage,
  UserStatus,
} from 'src/contracts';
import { activityService, channelService } from 'src/services';
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

  tryJoin({}, channel: string) {
    if (!channelService.in(channel)) channelService.join(channel);
  },

  async joinChannel({ commit, dispatch }, id: string) {
    const channel = await channelService.joinChannel(id);

    commit('ADD_CHANNEL', channel);

    await dispatch('join', channel.name);
  },

  async fetchMessages(
    { commit },
    { channel, page, limit }: { channel: string; page: number; limit: number }
  ) {
    try {
      const response = await channelService
        .in(channel)
        ?.loadMessages(page, limit);

      console.log('Fetching new messages: ', response);

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

  async addChannel({ commit, dispatch }, channel: Channel) {
    commit('ADD_CHANNEL', channel);

    await dispatch('join', channel.name);
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

  async getUserChannels({ commit, dispatch }) {
    try {
      commit('LOADING_START');

      const channels = await channelService.getUserChannels();

      commit('GET_USER_CHANNELS', channels);

      channels.forEach((channel) => {
        if (!channelService.in(channel.name))
          dispatch('join', channel.name).catch(console.log);
      });
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
      const activeChannelName = getters['getActiveChannelName'] as
        | string
        | null;

      console.log('Currently active channel is: ', activeChannelName);

      let channel = undefined;

      if (name) {
        channel = await channelService.getChannel(name);
      }

      console.log('Received channel is: ', channel);

      commit('SET_ACTIVE', name);
      commit('SET_ACTIVE_CHANNEL', channel);

      console.log('Newly active channel is: ', name);

      return channel;
    } catch (err) {
      await dispatch('leave', name);
      throw err;
    }
  },

  async delete({ commit, dispatch, getters }, name: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const channels = getters['getUserChannels'] as Channel[];

      const channelToDelete = channels.find((channel) => channel.name === name);

      if (!channelToDelete) return;

      const response = await channelService.delete(channelToDelete.id);

      await dispatch('leave', name);

      commit('REMOVE_CHANNEL', name);

      return response;
    } catch (err) {
      throw err;
    }
  },

  async changeUserStatus({}, status: UserStatus) {
    console.log('Sending status: ', status);
    void (await activityService.changeStatus(status));
  },

  async kickUser(
    {},
    { channelName, userId, method }: { channelName: string; userId: string, method: KickType }
  ) {
    const manager = channelService.in(channelName);

    if (!manager) return;

    await manager.kickUser({ userId, method } as KickUserRequest);
  },

  async sendTypedMessage({}, { channelName, message }: { channelName: string, message: RawMessage }) {
    const manager = channelService.in(channelName)

    if(!manager) return

    await manager.sendTypedMessage(message)
  }
};

export default actions;
