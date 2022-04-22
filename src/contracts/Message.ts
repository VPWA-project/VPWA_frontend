import { User } from './Auth';

export type RawMessage = string;

export interface SerializedMessage {
  createdBy: string;
  content: string;
  channelId: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  author: User;
}

export interface TypedMessage {
  content: string;
  author: User
  channel: string
}