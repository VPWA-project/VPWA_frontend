import { User, UserStatus } from '../user/state';

export enum ChannelType {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export enum InvitationState {
  Refuse = 'REFUSE',
  Accept = 'ACCEPT',
}

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
}

export interface Invitation {
  id: number;
  invitedBy: User;
  channel: Channel;
}

export interface InvitationInfo {
  id: number;
  state: InvitationState;
}

export interface ChannelsStateInterface {
  channels: Array<Channel>; // user's channels
  availableChannels: Array<Channel>; // available public channels
  invitations: Array<Invitation>;
  activeChannel?: Channel;
}

function state(): ChannelsStateInterface {
  return {
    channels: [
      {
        id: 1,
        name: 'Channel 1',
        type: ChannelType.Public,
      },
      {
        id: 2,
        name: 'Channel 2',
        type: ChannelType.Private,
      },
    ],
    availableChannels: [],
    invitations: [
      {
        id: 1,
        invitedBy: {
          id: 1,
          firstname: 'Jozko',
          lastname: 'Mrkvicka',
          nickname: 'jozino',
          email: 'jozino@gmail.com',
          status: UserStatus.Online,
        },
        channel: {
          id: 10,
          name: 'Channel 10',
          type: ChannelType.Public,
        },
      },
    ],
  };
}

export default state;
