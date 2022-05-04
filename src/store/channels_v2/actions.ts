import {
  Channel,
  KickType,
  KickUserRequest,
  RawMessage,
  User,
} from 'src/contracts';
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

  offline({ getters }, channel: string | null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const leaving: string[] =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      getters.joinedChannels;

    console.log(leaving);
    leaving.forEach((c) => {
      channelService.disconnect(c);
    });
  },

  async onlineDnd({ commit }) {
    try {
      const channels = await channelService.getUserChannels();

      channels.forEach((channel) => {
        channelService.join(channel.name);
      });
    } catch (err) {
      commit('LOADING_ERROR');
      throw err;
    }
  },

  async addChannel({ commit, dispatch }, channel: Channel) {
    commit('ADD_CHANNEL', channel);

    await dispatch('join', channel.name);
  },

  async addMessage(
    { commit },
    {
      channel,
      message,
      tags,
    }: { channel: string; message: RawMessage; tags?: string[] }
  ) {
    try {
      const newMessage = await channelService
        .in(channel)
        ?.addMessage(message, tags);
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

      return channels;
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

  leaveChannel({ getters }, name: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const channels = getters['getUserChannels'] as Channel[];

      const channelToDelete = channels.find((channel) => channel.name === name);

      if (!channelToDelete) return;

      channelService.leave(name);
    } catch (err) {
      throw err;
    }
  },

  async kickUser(
    {},
    {
      channelName,
      userId,
      method,
    }: { channelName: string; userId: string; method: KickType }
  ) {
    const manager = channelService.in(channelName);

    if (!manager) return;

    await manager.kickUser({ userId, method } as KickUserRequest);
  },

  async sendTypedMessage(
    {},
    { channelName, message }: { channelName: string; message: RawMessage }
  ) {
    const manager = channelService.in(channelName);

    if (!manager) return;

    await manager.sendTypedMessage(message);
  },

  async getChannelUsers(
    { commit },
    { channelName, channelId }: { channelName: string; channelId: string }
  ) {
    try {
      commit('LOADING_START');
      const users = await channelService.getSearchedUsers(channelId);
      console.log('Received users: ', users);
      console.log('Payload was: ', channelName);
      commit('GET_CHANNEL_USERS', { channel: channelName, users });
    } catch (err) {
      commit('LOADING_ERROR');
      throw err;
    }
  },

  userOnline({ commit }, userOnline: User) {
    const storedUsers = this.state.channels_v2.onlineDndUsers;
    if (!storedUsers.find((user) => user.id === userOnline.id)) {
      commit('ADD_TO_USER_LIST', userOnline);
    }
  },

  getUserByNicknameFromActiveChannelStore({ getters }, nickname: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const channelUsers = getters['getAllUsers'] as User[];

    return channelUsers.find((user) => user.nickname === nickname);
  },
};

export default actions;
