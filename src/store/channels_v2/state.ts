import {
  Channel,
  PageMetaData,
  SerializedMessage,
  TypedMessage,
} from 'src/contracts';
import { User } from 'src/contracts';

export interface ChannelsV2StateInterface {
  loading: boolean;
  error: Error | null;
  typedMessages: { [channel: string]: { [userId: string]: TypedMessage } };
  messages: { [channel: string]: SerializedMessage[] };
  pagination: { [channel: string]: PageMetaData };
  channels: Channel[];
  onlineDndUsers: User[];
  active: string | null;
  activeChannel: Channel | null;
}

function state(): ChannelsV2StateInterface {
  return {
    loading: false,
    error: null,
    typedMessages: {},
    messages: {},
    pagination: {},
    channels: [],
    onlineDndUsers: [],
    active: null,
    activeChannel: null,
  };
}

export default state;
