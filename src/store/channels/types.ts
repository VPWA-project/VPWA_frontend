import { ChannelType } from './state';

export type CreateChannelPayload = {
    name: string;
    type: ChannelType;
}

export type SearchPublicChannelsPayload = {
    searchText: string;
}