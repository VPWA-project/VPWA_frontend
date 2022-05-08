import { api } from 'src/boot/axios';
import {
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetChannelUserOptionsRequest,
  GetChannelUserOptionsResponse,
  GetUserInvitationsResponse,
  ResolveInvitationRequest,
  ResolveInvitationResponse,
} from 'src/contracts';

class InvitationService {
  async getUserInvitations() {
    const response = await api.get<GetUserInvitationsResponse>(
      'auth/me/invitations'
    );
    return response.data;
  }

  async resolveInvitation(id: string, data: ResolveInvitationRequest) {
    const response = await api.post<ResolveInvitationResponse>(
      `invitations/${id}`,
      data
    );
    return response.data;
  }

  async getUserOptions(data: GetAllUsersRequest) {
    const response = await api.get<GetAllUsersResponse>('users', {
      params: { ...data },
    });
    return response.data;
  }

  async getChannelUserOptions(id: string, data: GetChannelUserOptionsRequest) {
    const response = await api.get<GetChannelUserOptionsResponse>(
      `channels/${id}/invitableUsers`,
      { params: { ...data } }
    );

    return response.data;
  }
}

export default new InvitationService();
