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
  channels: Array<Channel>; // user's channels
  availableChannels: Array<Channel>; // available public channels
  invitations: Array<Channel>;
  activeChannel?: Channel;
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
    availableChannels: [],
    invitations: []
  };
}

export default state;
