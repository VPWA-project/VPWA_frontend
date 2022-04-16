import { ChannelType } from 'src/store/channels/state';

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
  createdAt: string;
  updatedAt: string;
}

export type CreateChannelResponse = Channel;

export type GetUserChannelsResponse = Channel[];
