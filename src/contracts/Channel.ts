import { User } from './Auth';
import { PaginatedResponse } from './Global';

export enum ChannelType {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

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

export type SearchPublicChannelsResponse = PaginatedResponse<Channel>;

export interface SearchPublicChannelsRequest {
  searchText: string;
  userId: string | undefined;
}

export type CreateChannelResponse = Channel;

export type GetUserChannelsResponse = Channel[];

export type GetChannelUsersResponse = User[];

export type DeleteChannelResponse = unknown;

export type GetChannelResponse = Channel;

export type JoinChannelResponse = Channel;

export enum KickType {
  Kick = 'KICK',
  Revoke = 'REVOKE',
}

export interface KickUserRequest {
  method: KickType;
  userId: string;
}
