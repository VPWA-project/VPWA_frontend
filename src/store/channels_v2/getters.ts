import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsV2StateInterface } from './state';

const getters: GetterTree<ChannelsV2StateInterface, StateInterface> = {
  someGetter(/* context */) {
    // your code
  },
};

export default getters;
