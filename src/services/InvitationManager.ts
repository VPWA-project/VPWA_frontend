import { BootFileParams } from '@quasar/app-webpack';
import { CreateInvitationRequest, Invitation } from 'src/contracts';
import { StateInterface } from 'src/store';
import { authManager } from '.';
import { SocketManager } from './SocketManager';

class InvitationManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    this.socket.on('invitation:receive', (invitation: Invitation) => {
      store.commit('invitations/ADD_INVITATION', invitation, { root: true });
    });

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect();
      } else {
        this.socket.disconnect();
      }
    });
  }

  public async sendInvitation(data: CreateInvitationRequest): Promise<unknown> {
    return this.emitAsync('invitation:create', data);
  }
}

export default new InvitationManager('/invitations');
