import { api } from 'src/boot/axios';
import { GetUserInvitationsResponse } from 'src/contracts';

class InvitationService {
  async getUserInvitations() {
    const response = await api.get<GetUserInvitationsResponse>(
      'auth/me/invitations'
    );
    return response.data;
  }
}

export default new InvitationService();
