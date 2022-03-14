import { MutationTree } from 'vuex';
import {
  Channel,
  ChannelsStateInterface,
  ChannelType,
  InvitationInfo,
  InvitationState,
} from './state';

const mutation: MutationTree<ChannelsStateInterface> = {
  createChannel: (state: ChannelsStateInterface, payload: Channel) => {
    state.channels.push(payload);
  },

  fetchUserChannels: (
    state: ChannelsStateInterface,
    payload: Array<Channel>
  ) => {
    state.channels = payload;
  },

  searchPublicChannels: (
    state: ChannelsStateInterface,
    payload: Array<Channel>
  ) => {
    state.availableChannels = payload;
  },

  removeFromPublicChannels: (
    state: ChannelsStateInterface,
    payload: number
  ) => {
    const index = state.availableChannels
      .map((channel) => channel.id)
      .indexOf(payload);

    if (index >= -1) {
      state.availableChannels.splice(index, 1);
    }
  },

  joinChannel: (state: ChannelsStateInterface, payload: Channel) => {
    state.channels.push(payload);
  },

  setActiveChannel: (state: ChannelsStateInterface, payload: Channel) => {
    state.activeChannel = payload;
  },

  leaveChannel: (state: ChannelsStateInterface, payload: Channel) => {
    const index = state.channels
      .map((channel) => channel.id)
      .indexOf(payload.id);

    if (index >= -1) {
      state.channels.splice(index, 1);

      if (payload.type === ChannelType.Public) {
        state.availableChannels.push(payload);
      }
    }
  },

  processInvitation: (
    state: ChannelsStateInterface,
    payload: InvitationInfo
  ) => {
    if (payload.state == InvitationState.Refuse) {
      const index = state.invitations.findIndex((el) => el.id === payload.id);
      if (index > -1) {
        state.invitations.splice(index, 1);
      }
    }
    if (payload.state == InvitationState.Accept) {
      const invitation = state.invitations.find((i) => i.id === payload.id);
      if (invitation) {
        state.channels.push({
          id: invitation.channel.id,
          name: invitation.channel.name,
          type: invitation.channel.type,
        });
      }

      const index = state.invitations.findIndex((el) => el.id === payload.id);
      if (index > -1) {
        state.invitations.splice(index, 1);
      }
    }
  },
};

export default mutation;
