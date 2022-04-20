import { BootFileParams } from '@quasar/app-webpack';
import { CreateInvitationRequest, Invitation } from 'src/contracts';
import { StateInterface } from 'src/store';
import { SocketManager } from './SocketManager';

class InvitationManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    this.socket.on('invitation:receive', (invitation: Invitation) => {
      store.commit('invitations/ADD_INVITATION', invitation, { root: true });
    });
  }

  public async sendInvitation(data: CreateInvitationRequest) {
    return this.emitAsync('invitation:create', data);
  }
}

export default new InvitationManager('/invitations');
