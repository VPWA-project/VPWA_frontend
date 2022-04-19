import { Channel, PageMetaData, SerializedMessage } from 'src/contracts';

export interface ChannelsV2StateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  pagination: { [channel: string]: PageMetaData };
  channels: Channel[];
  searchedChannels: Channel[];
  active: Channel | null;
}

function state(): ChannelsV2StateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    pagination: {},
    channels: [],
    searchedChannels: [],
    active: null,
  };
}

export default state;
