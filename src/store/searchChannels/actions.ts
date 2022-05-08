import { AxiosError } from 'axios';
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

      commit('LOADING_SUCCESS');
    } catch (err) {
      const error = err as AxiosError;

      commit('LOADING_ERROR', {
        message: error.message,
      });

      throw err;
    }
  },

  removePublicChannel({ commit }, id: string) {
    commit('REMOVE_PUBLIC_CHANNEL', id);
  },
};

export default actions;
