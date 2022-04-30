import { BootFileParams } from '@quasar/app-webpack';
import { api } from 'src/boot/axios';
import {
  CreateChannelRequest,
  CreateChannelResponse,
  GetUserChannelsResponse,
  PaginatedResponse,
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
  Channel,
} from 'src/contracts';
import { StateInterface } from 'src/store';
import { channelService } from '.';
import { SocketManager } from './SocketManager';
import { Notify } from 'quasar'

class ChannelSocketManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    const channel = this.namespace.split('/').pop() as string;

    this.socket.on('message', (message: SerializedMessage) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      store.commit('channels_v2/NEW_MESSAGE', { channel, message });

      console.log(message)

      Notify.create({
        message: `${message.message.substring(0, 30)}${
          message.message.length > 30 ? '...' : ''
        }`,
        //message: `${message.user.firstname} ${message.user.lastname}\n${message.user.nickname}`,
        caption: `@${message.user.nickname} - ${message.user.firstname} ${message.user.lastname}`,
        color: 'grey-2',
        textColor: 'black',
        position: 'bottom-right',
      });
    });

    this.socket.on(
      'user:receiveKick',
      async ({
        userId,
        channelName,
      }: {
        userId: string;
        channelName: string;
      }) => {
        // check if ID is mine, if so, disconnect socket from the server and delete server from the list of servers
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const authUser = store.getters[
          'auth/getAuthenticatedUser'
        ] as User | null;

        if (authUser?.id === userId) {
          store.commit('channels_v2/REMOVE_CHANNEL', channelName);
          await store.dispatch('channels_v2/leave', channelName);
        } else {
          // if not, delete user from the list of users
          store.commit('REMOVE_FROM_USER_LIST', userId);
        }
      }
    );

    this.socket.on('channel:receiveTyping', (message: TypedMessage) => {
      if (!!message.content)
        store.commit('channels_v2/NEW_TYPED_MESSAGE', message);
      else store.commit('channels_v2/REMOVE_TYPED_MESSAGE', message);
    });

    this.socket.on('channel:delete', (channel: Channel) => {
      store.commit('channels_v2/REMOVE_CHANNEL', channel.name);
      channelService.disconnect(channel.name);
    });

    this.socket.on(
      'channel:leave',
      ({ user, channel }: { user: User; channel: Channel }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const authUser = store.getters[
          'auth/getAuthenticatedUser'
        ] as User | null;

        if (authUser?.id === user.id) {
          store.commit('channels_v2/REMOVE_CHANNEL', channel.name);
          channelService.disconnect(channel.name);

          return;
        }

        console.log(`User: ${user.nickname} left the channel`);
      }
    );

    this.socket.on('channel:join', async (user: User) => {
      await store.dispatch('channels_v2/userOnline', user);
    })
  }

  public addMessage(message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message);
  }

  public loadMessages(
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<SerializedMessage[]>> {
    return this.emitAsync('loadMessages', page || 1, limit || 10);
  }

  public kickUser(data: KickUserRequest) {
    console.log('Kick data: ', data);
    return this.emitAsync('user:sendKick', data);
  }

  public sendTypedMessage(message: RawMessage) {
    return this.emitAsync('channel:sendTyping', message);
  }

  public leaveChannel() {
    console.log('Leaving channel');
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
