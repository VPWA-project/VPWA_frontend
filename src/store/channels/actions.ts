import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsStateInterface } from './state';
import { CreateChannelPayload } from './types';

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  createChannel: (context, payload: CreateChannelPayload) => {
    setTimeout(() => {
      context.commit('createChannel', payload);
    }, 2000);
  },
};

export default actions;
