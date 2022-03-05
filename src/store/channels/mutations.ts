import { MutationTree } from 'vuex';
import { Channel, ChannelsStateInterface } from './state';

const mutation: MutationTree<ChannelsStateInterface> = {
  createChannel(state: ChannelsStateInterface, payload: Channel) {
    state.channels.push(payload)
  },

  searchPublicChannels(state: ChannelsStateInterface, payload: Array<Channel>) {
    state.availableChannels = payload
  }
};

export default mutation;
