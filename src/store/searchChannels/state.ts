import { Channel } from 'src/contracts';

export interface SearchChannelsStateInterface {
  loading: boolean;
  error: Error | null;
  channels: Channel[];
}

function state(): SearchChannelsStateInterface {
  return {
    loading: false,
    error: null,
    channels: [],
  };
}

export default state;
