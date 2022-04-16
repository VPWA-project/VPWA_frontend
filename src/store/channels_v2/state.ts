import { Channel, SerializedMessage } from 'src/contracts';

export interface ChannelsV2StateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  channels: Channel[];
  active: Channel | null;
}

function state(): ChannelsV2StateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    channels: [],
    active: null,
  };
}

export default state;
