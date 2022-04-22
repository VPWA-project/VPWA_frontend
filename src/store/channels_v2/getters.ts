import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsV2StateInterface } from './state';
import { Channel, SerializedMessage, User, UserStatus } from 'src/contracts';

const getters: GetterTree<ChannelsV2StateInterface, StateInterface> = {
  joinedChannels(context) {
    return Object.keys(context.messages);
  },
  currentMessages(context) {
    if (!context.active) return [];

    const messages = context.messages[context.active] as
      | SerializedMessage[]
      | undefined;

    return messages?.length
      ? messages.sort(
          (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
        )
      : [];
  },
  currentTypedMessages(context) {
    if (!context.active) return [];

    const userMessages = context.typedMessages[context.active];
    const isEmpty = !userMessages || Object.keys(userMessages).length === 0;

    return isEmpty ? [] : Object.values(userMessages);
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
    return context.activeChannel;
  },
  getActiveChannelName(context) {
    return context.active;
  },
  getCurrentPageMetaData(context) {
    return context.active ? context.pagination[context.active] : null;
  },
  amIChannelAdmin(context, getters, _, rootGetters) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const activeChannel = getters['getActiveChannel'] as Channel | null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const authUser = rootGetters['auth/getAuthenticatedUser'] as User | null;

    return activeChannel?.administratorId === authUser?.id;
  },
  amIChannelMember(context) {
    const activeChannel = context.active;

    return !!context.channels.find((channel) => channel.name === activeChannel);
  },
  getOnlineUsers(context) {
    return context.onlineDndUsers.filter(
      (user) => user.status === UserStatus.Online
    );
  },
  getDndUsers(context) {
    return context.onlineDndUsers.filter(
      (user) => user.status === UserStatus.DND
    );
  },
  getOfflineUsers(context) {
    return context.onlineDndUsers.filter(
      (user) => user.status === UserStatus.OFFLINE
    );
  },
};

export default getters;
