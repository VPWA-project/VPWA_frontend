import { BootFileParams } from '@quasar/app-webpack';
import { User, UserStatus } from 'src/contracts';
import { authManager } from '.';
import { StateInterface } from '../store';
import { SocketManager } from './SocketManager';

class ActivitySocketManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    this.socket.on('user:list', (onlineUsers: User[], dndUsers: User[]) => {
      console.log('Online users list', onlineUsers);
      console.log('DND users list', dndUsers);
      store.commit('channels_v2/SET_USER_LIST', { onlineUsers, dndUsers });
    });

    this.socket.on('user:online', (userOnline: User) => {
      console.log('User is online', userOnline);
      //store.commit('channels_v2/ADD_TO_USER_LIST', userOnline);
    });

    this.socket.on('user:offline', (offlineUser: User) => {
      console.log('User is offline', offlineUser);
      store.commit('channels_v2/REMOVE_FROM_USER_LIST', offlineUser.id);
    });

    this.socket.on('user:receiveStatus', (changeUser: User) => {
      console.log('user to change status', changeUser);
      store.commit('channels_v2/CHANGE_USER_STATUS', changeUser);
    });

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect();
      } else {
        this.socket.disconnect();
      }
    });
  }

  public async changeStatus(status: UserStatus): Promise<unknown> {
    return this.emitAsync('user:sendStatus', status);
  }
}

export default new ActivitySocketManager('/');
