import { User } from './Auth';
import { Channel } from './Channel';

export interface Invitation {
  id: string;
  userId: string;
  invitedById: string;
  invitedBy: User;
  channelId: string;
  channel: Channel;
  createdAt: string;
  acceptedAt: string;
}

export type GetUserInvitationsResponse = Invitation[]