import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsStateInterface } from './state';

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
  getChannels(state) {
    return state.channels;
  },
};

export default getters;
