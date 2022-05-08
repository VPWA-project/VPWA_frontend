import { BootFileParams } from '@quasar/app-webpack';
import {
  CreateInvitationRequest,
  Invitation,
  InvitationStatus,
  ResolveInvitationRequest,
} from 'src/contracts';
import { StateInterface } from 'src/store';
import { authManager } from '.';
import { SocketManager } from './SocketManager';

class InvitationManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    this.socket.on('invitation:receive', (invitation: Invitation) => {
      store.commit('invitations/ADD_INVITATION', invitation, { root: true });
    });

    this.socket.on(
      'invitation:resolve',
      async ({
        invitation,
        status,
      }: {
        invitation: Invitation;
        status: InvitationStatus;
      }) => {
        console.log('Received invitation: ', invitation)
        console.log('Received status: ', status)

        store.commit('invitations/REMOVE_INVITATION', invitation.channel.name, {
          root: true,
        });

        if (status === 'ACCEPT')
          await store.dispatch('channels_v2/addChannel', invitation.channel, {
            root: true,
          });
      }
    );

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

  public async resolveInvitation(
    data: ResolveInvitationRequest
  ): Promise<Invitation> {
    return this.emitAsync('invitation:resolve', data);
  }
}

export default new InvitationManager('/invitations');
