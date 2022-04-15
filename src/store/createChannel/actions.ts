import { AxiosError } from 'axios';
import { CreateChannelRequest, ValidationErrorResponse } from 'src/contracts';
import { channelService } from 'src/services';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CreateChannelStateInterface } from './state';

const actions: ActionTree<CreateChannelStateInterface, StateInterface> = {
  async create({ commit }, payload: CreateChannelRequest) {
    try {
      commit('SUBMIT_START')

      const channel = await channelService.create(payload)

      commit('SUBMIT_SUCCESS', channel)
    }
    catch(err) {
      const error = err as AxiosError

      if(error.response?.status === 422) {
        const errors = error.response.data as ValidationErrorResponse
        commit('SUBMIT_ERROR', errors.errors)
      }

      throw err
    }
  },
};

export default actions;
