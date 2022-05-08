import {
  Channel,
  SerializedMessage,
  TypedMessage,
} from 'src/contracts';
import { User } from 'src/contracts';

export interface ChannelsV2StateInterface {
  loading: boolean;
  error: Error | null;
  typedMessages: { [channel: string]: { [userId: string]: TypedMessage } };
  messages: { [channel: string]: SerializedMessage[] };
  channels: Channel[];
  channelsUsers: { [channel: string]: User[] };
  searchedChannels: Channel[];
  onlineDndUsers: User[];
  offlineUsers: User[];
  active: string | null;
  activeChannel: Channel | null;
}

function state(): ChannelsV2StateInterface {
  return {
    loading: false,
    error: null,
    typedMessages: {},
    messages: {},
    channels: [],
    channelsUsers: {},
    searchedChannels: [],
    onlineDndUsers: [],
    offlineUsers: [],
    active: null,
    activeChannel: null,
  };
}

export default state;
