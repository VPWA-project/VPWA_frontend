import { BootFileParams } from '@quasar/app-webpack';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import {
  CreateChannelRequest,
  CreateChannelResponse,
  DeleteChannelResponse,
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
} from 'src/contracts';
import { StateInterface } from 'src/store';
import { SocketManager } from './SocketManager';

class ChannelSocketManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    const channel = this.namespace.split('/').pop() as string;

    this.socket.on('message', (message: SerializedMessage) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      store.commit('channels_v2/NEW_MESSAGE', { channel, message });
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

  public leave(name: string): boolean {
    const channel = this.channels.get(name);

    if (!channel) {
      return false;
    }

    // disconnect namespace and remove references to socket
    channel.destroy();

    return this.channels.delete(name);
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

  public async delete(id: string) {
    const response = await api.delete<DeleteChannelResponse>(`channels/${id}`);

    return response.data;
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
}

export default new ChannelService();
