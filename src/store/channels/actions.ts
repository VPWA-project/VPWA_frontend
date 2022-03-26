import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import {
  Channel,
  ChannelsStateInterface,
  ChannelType,
  InvitationInfo,
} from './state';
import { CreateChannelPayload, SearchPublicChannelsPayload } from './types';

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  createChannel: (context, payload: CreateChannelPayload) => {
    // TODO: POST to server
    setTimeout(() => {
      context.commit('createChannel', payload);
    }, 2000);
  },

  fetchUserChannels: (context) => {
    // TODO: fetch user channels from database

    const userChannels: Array<Channel> = [
      {
        id: 1,
        name: 'Channel 1',
        type: ChannelType.Public,
        messages: [],
      },
      {
        id: 2,
        name: 'Channel 2',
        type: ChannelType.Private,
        messages: [],
      },
    ];

    setTimeout(() => {
      context.commit('fetchUserChannels', userChannels);
    }, 2000);
  },

  searchPublicChannels: (context, payload: SearchPublicChannelsPayload) => {
    // TODO: fetch from server

    let availableChannels: Array<Channel> = [
      {
        id: 3,
        name: 'Channel 3',
        type: ChannelType.Public,
        messages: [],
      },
      {
        id: 4,
        name: 'Channel 4',
        type: ChannelType.Public,
        messages: [],
      },
      {
        id: 5,
        name: 'Channel 5',
        type: ChannelType.Public,
        messages: [],
      },
    ];

    const { searchText } = payload;

    if (!!searchText) {
      availableChannels = availableChannels.filter((channel) =>
        channel.name.includes(searchText)
      );
    }

    setTimeout(() => {
      context.commit('searchPublicChannels', availableChannels);
    }, 2000);
  },

  removeFromPublicChannels: (context, payload: number) => {
    context.commit('removeFromPublicChannels', payload);
  },

  appendChannelMessage: (
    context,
    payload: { channelId: number; message: string }
  ) => {
    context.commit('appendChannelMessage', payload);
  },

  joinChannel: (context, payload: Channel) => {
    // TODO: add in server

    setTimeout(() => {
      context.commit('joinChannel', payload);
    }, 2000);
  },

  setActiveChannel: (context, payload: Channel) => {
    context.commit('setActiveChannel', payload);
  },

  leaveChannel: (context, payload: Channel) => {
    // TODO: send request to server

    context.commit('leaveChannel', payload);
  },

  processInvitation: (context, payload: InvitationInfo) => {
    context.commit('processInvitation', payload);
  },

  amIChannelMember: (context) => {
    return !!context.state.channels.find(
      (channel) => channel.id === context.state.activeChannel?.id
    );
  },
};

export default actions;
