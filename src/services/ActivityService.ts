import { BootFileParams } from '@quasar/app-webpack';
import { User, UserStatus } from 'src/contracts';
import { authManager } from '.';
import { StateInterface } from '../store';
import { SocketManager } from './SocketManager';

class ActivitySocketManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    this.socket.on(
      'user:list',
      (onlineUsers: User[], dndUsers: User[], offlineUsers: User[]) => {
        store.commit('channels_v2/SET_USER_LIST', {
          onlineUsers,
          dndUsers,
          offlineUsers,
        });
      }
    );

    this.socket.on('user:online', (userOnline: User) => {
      //store.commit('channels_v2/ADD_TO_USER_LIST', userOnline);
      void store.dispatch('channels_v2/userOnline', userOnline);
    });

    this.socket.on('user:offline', (offlineUser: User) => {
      store.commit('channels_v2/REMOVE_FROM_USER_LIST', offlineUser.id);
    });

    this.socket.on('user:receiveStatus', (changeUser: User) => {
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
