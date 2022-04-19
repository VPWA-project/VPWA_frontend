import { ChannelType } from 'src/store/channels/state';
import { User } from './Auth';

export interface CreateChannelRequest {
  name: string;
  type: ChannelType;
  invitations?: string[];
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

export interface GetSearchChannelsResponse {
  meta: {
    current_page: number;
    first_page: number;
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    next_page_url: null;
    per_page: number;
    previous_page_url: null;
    total: number;
  };
  data: GetUserChannelsResponse;
}

export type CreateChannelResponse = Channel;

export type GetUserChannelsResponse = Channel[];

export type DeleteChannelResponse = unknown