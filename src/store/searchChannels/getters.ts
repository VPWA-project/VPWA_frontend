import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { SearchChannelsStateInterface } from './state';

const getters: GetterTree<SearchChannelsStateInterface, StateInterface> = {
  getPublicChannels(context) {
    return context.channels;
  },
  isLoading(context) {
    return context.loading
  },
  getServerError(context) {
    return context.error
  }
};

export default getters;
