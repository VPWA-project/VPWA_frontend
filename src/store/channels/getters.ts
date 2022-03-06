import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { Channel, ChannelsStateInterface } from './state';

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
  getChannels: (state) => {
    return state.channels;
  },

  getAvailableChannels: (state): Array<Channel> => {
    return state.availableChannels
  },

  getChannelById: (state) => (id: number): Channel | undefined => {
    return state.channels.find(channel => channel.id === id);
  }
};

export default getters;
