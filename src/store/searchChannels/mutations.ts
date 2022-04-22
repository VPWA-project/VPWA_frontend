import { Channel } from 'src/contracts';
import { MutationTree } from 'vuex';
import { SearchChannelsStateInterface } from './state';

const mutation: MutationTree<SearchChannelsStateInterface> = {
  LOADING_START(state) {
    state.loading = true;
    state.error = null;
  },
  SET_PUBLIC_CHANNELS(state, channels: Channel[]) {
    state.channels = channels;
  },
  LOADING_FINISH(state) {
    state.loading = false;
  },
  REMOVE_PUBLIC_CHANNEL(state, id: string) {
    state.channels = state.channels.filter((channel) => channel.id !== id);
  },
};

export default mutation;
