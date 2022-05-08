import {
  Channel,
  KickType,
  KickUserRequest,
  RawMessage,
  User,
  UserStatus,
} from 'src/contracts';
import { channelService } from 'src/services';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsV2StateInterface } from './state';

const actions: ActionTree<ChannelsV2StateInterface, StateInterface> = {
  async join({ commit, dispatch }, channel: string) {
    if (this.state.auth.user?.status === UserStatus.OFFLINE) {
      return;
    }
    try {
      commit('LOADING_START');

      const messages = await channelService.join(channel).loadMessages();
      void dispatch('getUserChannels')
        .then((channels: Channel[]) => {
          channels.forEach((foundChannel) => {
            if (foundChannel.name === channel) {
              dispatch('getChannelUsers', {
                channelId: foundChannel.id,
                channelName: foundChannel.name,
              }).catch(console.log);
            }
          });
        })
        .catch(console.log);

      commit('LOADING_SUCCESS', {
        channel,
        messages,
      });
    } catch (err) {
      commit('LOADING_ERROR', err);
      throw err;
    }
  },

  tryJoin({}, channel: string) {
    if (
      !channelService.in(channel) &&
      this.state.auth.user?.status !== UserStatus.OFFLINE
    )
      channelService.join(channel);
  },

  async joinChannel({ commit, dispatch }, id: string) {
    const channel = await channelService.joinChannel(id);

    commit('ADD_CHANNEL', channel);
    commit('invitations/REMOVE_INVITATION', channel.name, { root: true });

    await dispatch('join', channel.name);
  },

  async fetchMessages(
    { commit },
    {
      channel,
      beforeId,
      limit,
    }: { channel: string; beforeId?: number; limit?: number }
  ) {
    try {
      const messages = await channelService
        .in(channel)
        ?.loadMessages(beforeId, limit);

      commit('FETCH_MESSAGES', {
        channel,
        messages,
      });

      return messages ? messages : [];
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

  offline({ getters }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const leaving: string[] =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      getters.joinedChannels;

    leaving.forEach((c) => {
      channelService.disconnect(c);
    });
  },

  async onlineDnd({ commit, dispatch }) {
    try {
      const channels = await channelService.getUserChannels();

      channels.forEach((channel) => {
        channelService.join(channel.name);
        //const channelName = channel.name;
        //void dispatch('tryJoin', { channelName });
      });

      //setActiveChannel(route.params.name as string);

      channels.forEach((channel) => {
        commit('OFFLINE_CHANNEL', channel.name);
      });

      void dispatch('getUserChannels')
        .then((channels: Channel[]) => {
          channels.forEach((channel) => {
            dispatch('getChannelUsers', {
              channelId: channel.id,
              channelName: channel.name,
            }).catch(console.log);
          });
        })
        .catch(console.log);

      channels.forEach((channel) => {
        dispatch('fetchMessages', {
          channel: channel.name,
        }).catch(console.log);
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

  async setActiveChannel({ commit, dispatch }, name: string | undefined) {
    try {
      let channel = undefined;

      if (name) {
        channel = await channelService.getChannel(name);
      }

      commit('SET_ACTIVE', name);
      commit('SET_ACTIVE_CHANNEL', channel);

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
    { commit },
    {
      channelName,
      userId,
      method,
    }: { channelName: string; userId: string; method: KickType }
  ) {
    const manager = channelService.in(channelName);

    if (!manager) return;

    try {
      const success = await manager.kickUser({
        userId,
        method,
      } as KickUserRequest);
      commit('REMOVE_USER_FROM_CHANNEL', { userId, channelName });

      return success;
    } catch (err) {
      throw err;
    }
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

  async getChannel({}, channelName: string | undefined) {
    if (channelName) {
      return await channelService.getChannel(channelName);
    }

    return null;
  },
};

export default actions;
