import { BootFileParams } from '@quasar/app-webpack';
import { CreateInvitationRequest, Invitation, User } from 'src/contracts';
import { StateInterface } from 'src/store';
import { authManager } from '.';
import { SocketManager } from './SocketManager';

class ActivitySocketManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    this.socket.on('user:list', (onlineUsers: User[]) => {
      console.log('Online users list', onlineUsers);
    });

    this.socket.on('user:online', (user: User) => {
      console.log('User is online', user);
    });

    this.socket.on('user:offline', (user: User) => {
      console.log('User is offline', user);
    });

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

  public async sendInvitation(data: CreateInvitationRequest) {
    return this.emitAsync('invitation:send', data)
  }
}

export default new ActivitySocketManager('/');
