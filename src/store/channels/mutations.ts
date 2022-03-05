import { MutationTree } from 'vuex';
import { Channel, ChannelsStateInterface } from './state';

const mutation: MutationTree<ChannelsStateInterface> = {
  createChannel(state: ChannelsStateInterface, payload: Channel) {
    state.channels.push(payload)
  },
};

export default mutation;
