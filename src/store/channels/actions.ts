import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { Channel, ChannelsStateInterface, ChannelType } from './state';
import { CreateChannelPayload, SearchPublicChannelsPayload } from './types';

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  createChannel: (context, payload: CreateChannelPayload) => {
    // TODO: POST to server
    setTimeout(() => {
      context.commit('createChannel', payload);
    }, 2000);
  },

  searchPublicChannels: (context, payload: SearchPublicChannelsPayload) => {
    // TODO: fetch from server

    let availableChannels: Array<Channel> = [
      {
        id: 3,
        name: 'Channel 3',
        type: ChannelType.Public,
      },
      {
        id: 4,
        name: 'Channel 4',
        type: ChannelType.Public,
      },
      {
        id: 5,
        name: 'Channel 5',
        type: ChannelType.Public,
      },
    ];

    const {searchText} = payload

    if(!!searchText) {
      availableChannels = availableChannels.filter(channel => channel.name.includes(searchText))
    }

    setTimeout(() => {
      context.commit('searchPublicChannels', availableChannels);
    }, 2000);
  },
};

export default actions;
