import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsV2StateInterface } from './state';

const getters: GetterTree<ChannelsV2StateInterface, StateInterface> = {
  joinedChannels(context) {
    return Object.keys(context.messages);
  },
  currentMessages(context) {
    return context.active !== null ? context.messages[context.active.name] : [];
  },
  lastMessageOf(context) {
    return (channel: string) => {
      const messages = context.messages[channel];
      return messages.length > 0 ? messages[messages.length - 1] : null;
    };
  },
  getUserChannels(context) {
    return context.channels
  },
  getActiveChannel(context) {
    return context.active
  }
};

export default getters;
