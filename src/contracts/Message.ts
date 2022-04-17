import { User } from './Auth';

export type RawMessage = string;

export interface SerializedMessage {
  createdBy: string;
  content: string;
  channelId: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  author: User;
}

export interface GetChannelMessagesRequest {
  page: number;
  limit: number;
}

export interface PageMetaData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  previous_page_url: string | null;
}

export interface PaginatedResponse<T> {
  meta: PageMetaData;
  data: T;
}
