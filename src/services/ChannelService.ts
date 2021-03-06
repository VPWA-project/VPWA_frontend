import { BootFileParams } from '@quasar/app-webpack';
import { api } from 'src/boot/axios';
import {
  CreateChannelRequest,
  CreateChannelResponse,
  GetUserChannelsResponse,
  RawMessage,
  SerializedMessage,
  User,
  SearchPublicChannelsRequest,
  SearchPublicChannelsResponse,
  GetChannelResponse,
  JoinChannelResponse,
  KickUserRequest,
  TypedMessage,
  GetChannelUsersResponse,
  UserStatus,
} from 'src/contracts';
import { StateInterface } from 'src/store';
import { channelService } from '.';
import { SocketManager } from './SocketManager';
import { Notify, AppVisibility } from 'quasar';

class ChannelSocketManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    const channel = this.namespace.split('/').pop() as string;

    this.socket.on('message', (message: SerializedMessage) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      store.commit('channels_v2/NEW_MESSAGE', { channel, message });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const authUser = store.getters[
        'auth/getAuthenticatedUser'
      ] as User | null;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const onlyNotifications = store.getters[
        'auth/getOnlyNotifications'
      ] as boolean;

      if (authUser?.status !== UserStatus.DND) {
        if (onlyNotifications) {
          if (authUser && message.message.includes('@' + authUser.nickname)) {
            if (AppVisibility.appVisible) {
              Notify.create({
                message: `${message.message.substring(0, 30)}${
                  message.message.length > 30 ? '...' : ''
                }`,
                caption: `${channel}: @${message.user.nickname} - ${message.user.firstname} ${message.user.lastname}`,
                color: 'grey-2',
                textColor: 'black',
                position: 'bottom-right',
              });
            } else {
              // Notifikacie

              // Let's check if the browser supports notifications
              if (!('Notification' in window)) {
                alert('This browser does not support desktop notification');
              }
              // Let's check whether notification permissions have already been granted
              else if (Notification.permission === 'granted') {
                // If it's okay let's create a notification
                new Notification(message.message, {
                  body: `${channel}: @${message.user.nickname} - ${message.user.firstname} ${message.user.lastname}`,
                });
              }
              // Otherwise, we need to ask the user for permission
              else if (Notification.permission !== 'denied') {
                Notification.requestPermission()
                  .then(function (permission) {
                    // If the user accepts, let's create a notification
                    if (permission === 'granted') {
                      new Notification(message.message, {
                        body: `${channel}: @${message.user.nickname} - ${message.user.firstname} ${message.user.lastname}`,
                      });
                    }
                  })
                  .catch(console.log);
              }
            }
          }
        } else {
          if (AppVisibility.appVisible) {
            Notify.create({
              message: `${message.message.substring(0, 30)}${
                message.message.length > 30 ? '...' : ''
              }`,
              caption: `${channel}: @${message.user.nickname} - ${message.user.firstname} ${message.user.lastname}`,
              color: 'grey-2',
              textColor: 'black',
              position: 'bottom-right',
            });
          } else {
            // Notifikacie

            // Let's check if the browser supports notifications
            if (!('Notification' in window)) {
              alert('This browser does not support desktop notification');
            }
            // Let's check whether notification permissions have already been granted
            else if (Notification.permission === 'granted') {
              // If it's okay let's create a notification
              new Notification(message.message, {
                body: `${channel}: @${message.user.nickname} - ${message.user.firstname} ${message.user.lastname}`,
              });
            }
            // Otherwise, we need to ask the user for permission
            else if (Notification.permission !== 'denied') {
              Notification.requestPermission()
                .then(function (permission) {
                  // If the user accepts, let's create a notification
                  if (permission === 'granted') {
                    new Notification(message.message, {
                      body: `${channel}: @${message.user.nickname} - ${message.user.firstname} ${message.user.lastname}`,
                    });
                  }
                })
                .catch(console.log);
            }
          }
        }
      }
    });

    this.socket.on(
      'user:receiveKick',
      async ({ userId }: { userId: string }) => {
        // check if ID is mine, if so, disconnect socket from the server and delete server from the list of servers
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const authUser = store.getters[
          'auth/getAuthenticatedUser'
        ] as User | null;

        if (authUser?.id === userId) {
          store.commit('channels_v2/REMOVE_CHANNEL', channel);
          await store.dispatch('channels_v2/leave', channel);
          // TODO: redirect with vue router
          window.location.href = '/';
        } else {
          // if not, delete user from the list of users
          store.commit('channels_v2/REMOVE_USER_FROM_CHANNEL', {
            userId,
            channelName: channel,
          });
        }
      }
    );

    this.socket.on('channel:receiveTyping', (message: TypedMessage) => {
      if (!!message.content)
        store.commit('channels_v2/NEW_TYPED_MESSAGE', message);
      else
        store.commit('channels_v2/REMOVE_TYPED_MESSAGE', {
          channelName: message.channel,
          userId: message.author.id,
        });
    });

    this.socket.on('channel:delete', () => {
      store.commit('channels_v2/REMOVE_CHANNEL', channel);
      channelService.disconnect(channel);
      // TODO: redirect with vue router
      window.location.href = '/';
    });

    this.socket.on('channel:leave', ({ user }: { user: User }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const authUser = store.getters[
        'auth/getAuthenticatedUser'
      ] as User | null;

      if (authUser?.id === user.id) {
        store.commit('channels_v2/REMOVE_CHANNEL', channel);
        channelService.disconnect(channel);
      }

      store.commit('channels_v2/REMOVE_USER_FROM_CHANNEL', {
        userId: user.id,
        channelName: channel,
      });
    });

    this.socket.on('channel:connect', async (user: User) => {
      const channelUsers = store.state.channels_v2.channelsUsers[channel];
      const userToFind = channelUsers.find(
        (findUser) => findUser.id === user.id
      );
      if (userToFind) {
        user.status = UserStatus.OFFLINE;
      }
      await store.dispatch('channels_v2/userOnline', user);
      store.commit('channels_v2/ADD_CHANNEL_USER', { channel, user });
    });

    this.socket.on('channel:disconnect', (user: User) => {
      console.log(`User ${user.nickname} is disconnecting from ${channel}`);
      store.commit('channels_v2/REMOVE_TYPED_MESSAGE', {
        channelName: channel,
        userId: user.id,
      });
    });
  }

  public addMessage(
    message: RawMessage,
    tags?: string[]
  ): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message, tags);
  }

  public loadMessages(
    beforeId?: number,
    limit?: number
  ): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages', beforeId, limit || 50);
  }

  public kickUser(data: KickUserRequest): Promise<boolean> {
    return this.emitAsync('user:sendKick', data);
  }

  public sendTypedMessage(message: RawMessage) {
    return this.emitAsync('channel:sendTyping', message);
  }

  public leaveChannel() {
    return this.emitAsync('channel:leave');
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map();

  public join(name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already joined in channel "${name}"`);
    }

    const channel = new ChannelSocketManager(`/channels/${name}`);

    this.channels.set(name, channel);

    return channel;
  }

  public leave(name: string) {
    const channel = this.channels.get(name);

    if (!channel) {
      return;
    }

    void channel.leaveChannel();
  }

  public disconnect(name: string) {
    const channel = this.in(name);

    if (!channel) return;

    channel.destroy();
    this.channels.delete(name);
  }

  public in(name: string): ChannelSocketManager | undefined {
    return this.channels.get(name);
  }

  public async create(data: CreateChannelRequest) {
    const channel = await api.post<CreateChannelResponse>('channels', data);
    return channel.data;
  }

  public async getUserChannels() {
    const channels = await api.get<GetUserChannelsResponse>(
      '/auth/me/channels'
    );
    return channels.data;
  }

  // get user's channels, in which he already is
  public async getSearchedChannel() {
    const channels = await api.get<GetUserChannelsResponse>(
      '/auth/me/channels'
    );
    return channels.data;
  }

  // get searched channels
  public async getSearchedChannels(payload: SearchPublicChannelsRequest) {
    const channels = await api.get<SearchPublicChannelsResponse>('/channels', {
      params: { ...payload },
    });
    return channels.data;
  }

  public async getChannel(name: string) {
    const channel = await api.get<GetChannelResponse>(`channels/${name}`, {
      params: { name },
    });

    return channel.data;
  }

  public async joinChannel(id: string) {
    const response = await api.post<JoinChannelResponse>(`channels/${id}/join`);
    return response.data;
  }

  public async getSearchedUsers(payload: string) {
    const users = await api.get<GetChannelUsersResponse>(
      `channels/${payload}/users`,
      {}
    );
    return users.data;
  }
}

export default new ChannelService();
