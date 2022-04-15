import { SerializedMessage } from 'src/contracts';

export interface ChannelsV2StateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  active: string | null;
}

function state(): ChannelsV2StateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: null,
  };
}

export default state;
