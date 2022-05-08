import { Channel, ServerError } from 'src/contracts';

export interface SearchChannelsStateInterface {
  loading: boolean;
  error: ServerError | null;
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
