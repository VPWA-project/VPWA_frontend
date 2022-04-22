import {
  Channel,
  PageMetaData,
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
      page,
    }: { channel: string; messages: SerializedMessage[]; page: PageMetaData }
  ) {
    state.loading = false;
    state.messages[channel] = messages;
    state.pagination[channel] = page;
  },
  LOADING_ERROR(state, error: Error | null) {
    state.loading = false;
    state.error = error;
  },
  CLEAR_CHANNEL(state, channel: string) {
    state.active = null;
    delete state.messages[channel];
    delete state.pagination[channel];
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
  NEW_TYPED_MESSAGE(state, { message }: { message: TypedMessage }) {
    if (!state.typedMessages[message.channel])
      state.typedMessages[message.channel] = {};
    state.typedMessages[message.channel][message.author.id] = message;
  },
  ADD_CHANNEL(state, channel: Channel) {
    state.channels.push(channel);
  },
  REMOVE_CHANNEL(state, name: string) {
    state.active = null;
    delete state.messages[name];
    delete state.pagination[name];
    state.channels = state.channels.filter((channel) => channel.name !== name);
  },
  FETCH_MESSAGES(
    state,
    {
      channel,
      messages,
      page,
    }: { channel: string; messages: SerializedMessage[]; page: PageMetaData }
  ) {
    state.messages[channel].push(...messages);
    state.pagination[channel] = page;
  },
  GET_USER_CHANNELS(state, channels: Channel[]) {
    state.channels = channels;
  },
  SET_USER_LIST(state, users: User[]) {
    state.onlineDndUsers = users.map((user) => ({
      ...user,
      status: UserStatus.Online,
    }));
    console.log(state.onlineDndUsers);
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
    console.log(user);
    const index = state.onlineDndUsers.findIndex((u) => u.id === user.id);
    if (index > -1) {
      state.onlineDndUsers[index] = user;
    }
  },
};

export default mutation;
