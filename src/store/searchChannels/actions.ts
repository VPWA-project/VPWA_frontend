import { SearchPublicChannelsRequest } from 'src/contracts';
import { channelService } from 'src/services';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { SearchChannelsStateInterface } from './state';

const actions: ActionTree<SearchChannelsStateInterface, StateInterface> = {
  async searchPublicChannels({ commit }, payload: SearchPublicChannelsRequest) {
    try {
      commit('LOADING_START');

      const channels = await channelService.getSearchedChannels(payload);

      commit('SET_PUBLIC_CHANNELS', channels.data);
    } catch (err) {
      throw err;
    } finally {
      commit('LOADING_FINISH');
    }
  },

  removePublicChannel({commit}, id: string) {
    commit('REMOVE_PUBLIC_CHANNEL', id)
  }
};

export default actions;
