import { User, UserStatus } from '../user/state';

export enum ChannelType {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export enum InvitationState {
  Refuse = 'REFUSE',
  Accept = 'ACCEPT',
}

export interface Message {
  tag: boolean;
  message: string;
}

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
  messages: Message[];
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
        messages: [
          { tag: true, message: 'Hello' },
          { tag: false, message: 'Good morning' },
          { tag: false, message: 'Bye' },
          { tag: true, message: 'How are you ?' },
        ],
      },
      {
        id: 2,
        name: 'Channel 2',
        type: ChannelType.Private,
        messages: [
          { tag: false, message: 'Hi, my name is Jozko' },
          { tag: true, message: 'Hello, Jozko !' },
          { tag: false, message: 'How is it going ?' },
          { tag: false, message: 'Pretty well' },
        ],
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
          messages: [
            { tag: false, message: 'Hi, my name is Jozko' },
            { tag: true, message: 'Hello, Jozko !' },
            { tag: false, message: 'How is it going ?' },
            { tag: false, message: 'Pretty well' },
          ],
        },
      },
    ],
  };
}

export default state;
