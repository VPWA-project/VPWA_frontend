import {
  Channel,
  SerializedMessage,
  TypedMessage,
  User,
  UserStatus,
} from 'src/contracts';
import { MutationTree } from 'vuex';
import { ChannelsV2StateInterface } from './state';

const mutation: MutationTree<ChannelsV2StateInterface> = {
  LOADING_START(state) {
    state.loading = true;
    state.error = null;
  },
  LOADING_SUCCESS(
    state,
    {
      channel,
      messages,
    }: { channel: string; messages: SerializedMessage[] }
  ) {
    state.loading = false;
    state.messages[channel] = messages;
  },
  LOADING_ERROR(state, error: Error | null) {
    state.loading = false;
    state.error = error;
  },
  CLEAR_CHANNEL(state, channel: string) {
    state.active = null;
    delete state.messages[channel];
  },
  OFFLINE_CHANNEL(state, channel: string) {
    state.messages[channel] = [];
    state.channelsUsers[channel] = [];
  },
  SET_ACTIVE(state, channel: string | null) {
    state.active = channel;
  },
  SET_ACTIVE_CHANNEL(state, channel: Channel | null) {
    state.activeChannel = channel;
  },
  NEW_MESSAGE(
    state,
    { channel, message }: { channel: string; message: SerializedMessage }
  ) {
    state.messages[channel].push(message);
  },
  NEW_TYPED_MESSAGE(state, message: TypedMessage) {
    if (!state.typedMessages[message.channel])
      state.typedMessages[message.channel] = {};
    state.typedMessages[message.channel][message.author.id] = message;
  },
  REMOVE_TYPED_MESSAGE(
    state,
    { channelName, userId }: { channelName: string; userId: string }
  ) {
    if (!state.typedMessages[channelName]) return;

    delete state.typedMessages[channelName][userId];
  },
  ADD_CHANNEL(state, channel: Channel) {
    state.channels.push(channel);
  },
  REMOVE_CHANNEL(state, name: string) {
    state.active = null;
    delete state.messages[name];
    state.channels = state.channels.filter((channel) => channel.name !== name);
  },
  REMOVE_USER_FROM_CHANNEL(
    state,
    { userId, channelName }: { userId: string; channelName: string }
  ) {
    console.log(state.channelsUsers);
    state.channelsUsers[channelName] = state.channelsUsers[channelName].filter(
      (obj) => obj.id !== userId
    );
    console.log(state.channelsUsers);
  },
  FETCH_MESSAGES(
    state,
    {
      channel,
      messages,
    }: { channel: string; messages: SerializedMessage[] }
  ) {
    state.messages[channel].push(...messages);
  },
  GET_USER_CHANNELS(state, channels: Channel[]) {
    state.channels = channels;
  },
  ADD_CHANNEL_USER(state, { channel, user }: { channel: string; user: User }) {
    const users = state.channelsUsers[channel] || [];
    users.push(user);

    if (!state.channelsUsers[channel]) state.channelsUsers[channel] = users;
  },
  GET_CHANNEL_USERS(
    state,
    { channel, users }: { channel: string; users: User[] }
  ) {
    state.channelsUsers[channel] = users;
  },
  SET_USER_LIST(
    state,
    { onlineUsers, dndUsers }: { onlineUsers: User[]; dndUsers: User[] }
  ) {
    const online = onlineUsers.map((user) => ({
      ...user,
      status: UserStatus.Online,
    }));

    const dnd = dndUsers.map((user) => ({
      ...user,
      status: UserStatus.DND,
    }));

    state.onlineDndUsers = [...online, ...dnd];
  },
  ADD_TO_USER_LIST(state, user: User) {
    state.onlineDndUsers.push({ ...user, status: UserStatus.Online });
  },
  REMOVE_FROM_USER_LIST(state, userId: string) {
    state.onlineDndUsers = state.onlineDndUsers.filter(
      (user) => user.id !== userId
    );
  },
  CHANGE_USER_STATUS(state, user: User) {
    const index = state.onlineDndUsers.findIndex((u) => u.id === user.id);
    if (index > -1) {
      state.onlineDndUsers[index] = user;
    } else {
      state.onlineDndUsers.push(user);
    }
  },
};

export default mutation;
