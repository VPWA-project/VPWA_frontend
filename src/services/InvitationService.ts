import { AxiosRequestConfig } from 'axios';
import { api } from 'src/boot/axios';
import {
  GetAllUsersRequest,
  GetAllUsersResponse,
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
    const response = await api.get<GetAllUsersResponse>(
      'users',
      data as AxiosRequestConfig
    );
    return response.data;
  }
}

export default new InvitationService();
