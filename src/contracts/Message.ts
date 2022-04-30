import { User } from './Auth';

export type RawMessage = string;

export interface SerializedMessage {
  userId: string;
  message: string;
  channelId: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  user: User
}

export interface TypedMessage {
  content: string;
  author: User
  channel: string
}