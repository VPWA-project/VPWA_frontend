export enum ChannelType {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
}
export interface ChannelsStateInterface {
  channels: Array<Channel>;
  availableChannels: Array<Channel>;
}

function state(): ChannelsStateInterface {
  return {
    channels: [
      {
        id: 1,
        name: 'Channel 1',
        type: ChannelType.Public
      },
      {
        id: 2,
        name: 'Channel 2',
        type: ChannelType.Private
      }
    ],
    availableChannels: []
  };
}

export default state;
