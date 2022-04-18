import { User } from './Auth';
import { Channel } from './Channel';
import { PaginatedRequest, PaginatedResponse } from './Global';

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

export type GetUserInvitationsResponse = Invitation[];

export type InvitationStatus = 'ACCEPT' | 'DECLINE';

export interface ResolveInvitationRequest {
  status: InvitationStatus;
}

export type ResolveInvitationResponse = unknown;

export interface GetAllUsersRequest extends PaginatedRequest {
  search?: string;
}

export type GetAllUsersResponse = PaginatedResponse<User[]>;

export interface CreateInvitationRequest {
  channelId: string;
  userId: string;
}

export type CreateInvitationResponse = unknown