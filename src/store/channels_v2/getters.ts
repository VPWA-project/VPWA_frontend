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
  getAdministrator(context, getters, _, rootGetters) {
    if (!context.activeChannel) return undefined;
    const administrator = context.activeChannel.administrator;
    const storedUsers = context.onlineDndUsers;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const authUser = rootGetters['auth/getAuthenticatedUser'] as User | null;
    const aa = storedUsers.find((admin) => admin.id === administrator.id);
    if (administrator.id === authUser?.id) {
      if (authUser?.status === undefined) {
        administrator.status = UserStatus.Online;
        return administrator;
      } else {
        administrator.status = authUser.status;
        return administrator;
      }
    } else if (aa) {
      administrator.status = aa?.status;
      return administrator;
    } else {
      administrator.status = UserStatus.OFFLINE;
      return administrator;
    }
  },
  getActiveChannelName(context) {
    return context.active;
  },
  getOldestMessageId(context) {
    if (!context.active) return undefined;

    const messages = context.messages[context.active];

    return messages
      ? Math.min.apply(
          null,
          messages.map((message) => message.id as unknown as number)
        )
      : undefined;
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
  getOnlineDndUsers(context, getters, store) {
    const activeChannel = context.activeChannel;
    const storedUsers = context.onlineDndUsers;

    if (!activeChannel) return undefined;
    const administrator = activeChannel.administrator;
    const authUser = store.auth.user;
    if (!authUser) return undefined;

    const channelUsers = context.channelsUsers[activeChannel.name] || [];
    const onlineDndUsers = [] as User[];

    storedUsers.forEach((channelUser) => {
      if (channelUsers.find((storedUser) => storedUser.id === channelUser.id)) {
        if (
          channelUser.id != administrator.id &&
          channelUser.id != authUser.id
        ) {
          onlineDndUsers.push(channelUser);
        }
      }
    });

    return onlineDndUsers;
  },
  getOfflineUsers(context, getters, store) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const activeChannel = context.activeChannel;
    if (!activeChannel) return undefined;
    const storedUsers = context.onlineDndUsers;
    const administrator = activeChannel.administrator;
    const authUser = store.auth.user;
    if (!authUser) return undefined;

    const channelUsers = context.channelsUsers[activeChannel.name] || [];
    const offlineUsers = [] as User[];

    channelUsers.forEach((channelUser) => {
      if (!storedUsers.find((storedUser) => storedUser.id === channelUser.id)) {
        if (
          channelUser.id != administrator.id &&
          channelUser.id != authUser.id &&
          !offlineUsers.find((asd) => asd.id === channelUser.id)
        ) {
          channelUser.status = UserStatus.OFFLINE;
          offlineUsers.push(channelUser);
        }
      }
    });

    return offlineUsers;
  },
  getAllUsers(context) {
    const activeChannel = context.activeChannel;

    if (!activeChannel) return;

    return activeChannel ? context.channelsUsers[activeChannel?.name] : [];
  },
};

export default getters;
