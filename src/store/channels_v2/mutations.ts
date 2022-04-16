import { Channel, SerializedMessage } from 'src/contracts';
import { MutationTree } from 'vuex';
import { ChannelsV2StateInterface } from './state';

const mutation: MutationTree<ChannelsV2StateInterface> = {
  LOADING_START(state) {
    state.loading = true
    state.error = null
  },
  LOADING_SUCCESS(state, { channel, messages }: { channel: string, messages: SerializedMessage[] }) {
    state.loading = false
    state.messages[channel] = messages
  },
  LOADING_ERROR(state, error: Error | null) {
    state.loading = false
    state.error = error
  },
  CLEAR_CHANNEL(state, channel: string) {
    state.active = null
    delete state.messages[channel]
  },
  SET_ACTIVE(state, channel: Channel) {
    state.active = channel
  },
  NEW_MESSAGE(state, { channel, message }: { channel: string, message: SerializedMessage }) {
    state.messages[channel].push(message)
  },
  GET_USER_CHANNELS(state, channels: Channel[]) {
    state.channels = channels
  }
};

export default mutation;
