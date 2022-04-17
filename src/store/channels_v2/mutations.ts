import { Channel, PageMetaData, SerializedMessage } from 'src/contracts';
import { MutationTree } from 'vuex';
import { ChannelsV2StateInterface } from './state';

const mutation: MutationTree<ChannelsV2StateInterface> = {
  LOADING_START(state) {
    state.loading = true
    state.error = null
  },
  LOADING_SUCCESS(state, { channel, messages, page }: { channel: string, messages: SerializedMessage[], page: PageMetaData }) {
    state.loading = false
    state.messages[channel] = messages
    state.pagination[channel] = page
  },
  LOADING_ERROR(state, error: Error | null) {
    state.loading = false
    state.error = error
  },
  CLEAR_CHANNEL(state, channel: string) {
    state.active = null
    delete state.messages[channel]
    delete state.pagination[channel]
  },
  SET_ACTIVE(state, channel: Channel) {
    state.active = channel
  },
  NEW_MESSAGE(state, { channel, message }: { channel: string, message: SerializedMessage }) {
    state.messages[channel].push(message)
  },
  FETCH_MESSAGES(state, { channel, messages, page }: { channel: string, messages: SerializedMessage[], page: PageMetaData }) {
    state.messages[channel].push(...messages)
    state.pagination[channel] = page
  },
  GET_USER_CHANNELS(state, channels: Channel[]) {
    state.channels = channels
  }
};

export default mutation;
