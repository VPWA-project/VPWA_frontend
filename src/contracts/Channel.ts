import { ChannelType } from 'src/store/channels/state';
import { User } from './Auth';

export interface CreateChannelRequest {
  name: string;
  type: ChannelType;
  invitations: string[];
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  administratorId: string;
  administrator: User;
  createdAt: string;
  updatedAt: string;
}

export type CreateChannelResponse = Channel;

export type GetUserChannelsResponse = Channel[];
