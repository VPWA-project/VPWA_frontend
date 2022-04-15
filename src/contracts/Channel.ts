import { ChannelType } from 'src/store/channels/state';

export interface CreateChannelRequest {
  name: string;
  type: ChannelType;
  invitations: string[];
}

export interface CreateChannelResponse {
  name: string;
  type: ChannelType;
  administratorId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
