import { BootFileParams } from '@quasar/app-webpack';
import { api } from 'src/boot/axios';
import {
  CreateChannelRequest,
  CreateChannelResponse,
  DeleteChannelResponse,
  GetUserChannelsResponse,
  GetSearchChannelsResponse,
  PaginatedResponse,
  RawMessage,
  SerializedMessage,
} from 'src/contracts';
import { StateInterface } from 'src/store';
import { SocketManager } from './SocketManager';
import { SearchPublicChannelsPayload } from 'src/store/channels/types';

class ChannelSocketManager extends SocketManager {
  public subscribe({ store }: BootFileParams<StateInterface>): void {
    const channel = this.namespace.split('/').pop() as string;

    this.socket.on('message', (message: SerializedMessage) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      store.commit('channels_v2/NEW_MESSAGE', { channel, message });
    });
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
  public async getSearchedChannels(payload: SearchPublicChannelsPayload) {
    const data = {
      params: payload,
    };

    const channels = await api.get<GetSearchChannelsResponse>(
      '/channels',
      data
    );
    return channels.data['data'];
  }
}

export default new ChannelService();
