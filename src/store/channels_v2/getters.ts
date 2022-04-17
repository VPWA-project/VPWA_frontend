import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsV2StateInterface } from './state';
import moment from 'moment';

const getters: GetterTree<ChannelsV2StateInterface, StateInterface> = {
  joinedChannels(context) {
    return Object.keys(context.messages);
  },
  currentMessages(context) {
    if(!context.active) return []

    const messages = context.messages[context.active]

    return messages ? messages.sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt))) : []
  },
  lastMessageOf(context) {
    return (channel: string) => {
      const messages = context.messages[channel];
      return messages.length > 0 ? messages[messages.length - 1] : null;
    };
  },
  getUserChannels(context) {
    return context.channels;
  },
  getActiveChannel(context) {
    if(!context.active) return null

    return context.channels.find(channel => channel.name === context.active)
  },
  getActiveChannelName(context) {
    return context.active
  },
  getCurrentPageMetaData(context) {
    return context.active ? context.pagination[context.active] : null;
  },
};

export default getters;
