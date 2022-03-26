import { User, UserStatus } from '../user/state';
import moment from 'moment';

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
  createdAt: Date;
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
  amIChannelMember: boolean
}

function state(): ChannelsStateInterface {
  return {
    channels: [
      {
        id: 1,
        name: 'Channel 1',
        type: ChannelType.Public,
        messages: [
          {
            tag: true,
            message: 'Hello',
            createdAt: moment(moment.now()).subtract(2, 'days').toDate(),
          },
          {
            tag: false,
            message: 'Good morning',
            createdAt: moment(moment.now()).subtract(1, 'days').toDate(),
          },
          {
            tag: false,
            message: 'Bye',
            createdAt: moment(moment.now()).subtract(1, 'hours').toDate(),
          },
          {
            tag: true,
            message: 'How are you ?',
            createdAt: moment(moment.now()).subtract(1, 'minutes').toDate(),
          },
        ],
      },
      {
        id: 2,
        name: 'Channel 2',
        type: ChannelType.Private,
        messages: [
          {
            tag: false,
            message: 'Hi, my name is Jozko',
            createdAt: moment(moment.now()).subtract(2, 'days').toDate(),
          },
          {
            tag: true,
            message: 'Hello, Jozko !',
            createdAt: moment(moment.now()).subtract(1, 'days').toDate(),
          },
          {
            tag: false,
            message: 'How is it going ?',
            createdAt: moment(moment.now()).subtract(1, 'hours').toDate(),
          },
          {
            tag: false,
            message: 'Pretty well',
            createdAt: moment(moment.now()).subtract(1, 'minutes').toDate(),
          },
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
            {
              tag: false,
              message: 'Hi, my name is Jozko',
              createdAt: moment(moment.now()).subtract(2, 'days').toDate(),
            },
            {
              tag: true,
              message: 'Hello, Jozko !',
              createdAt: moment(moment.now()).subtract(1, 'days').toDate(),
            },
            {
              tag: false,
              message: 'How is it going ?',
              createdAt: moment(moment.now()).subtract(1, 'hours').toDate(),
            },
            {
              tag: false,
              message: 'Pretty well',
              createdAt: moment(moment.now()).subtract(1, 'minutes').toDate(),
            },
          ],
        },
      },
    ],
    amIChannelMember: false
  };
}

export default state;
