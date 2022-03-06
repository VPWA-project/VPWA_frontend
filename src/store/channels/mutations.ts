import { MutationTree } from 'vuex';
import { Channel, ChannelsStateInterface, ChannelType } from './state';

const mutation: MutationTree<ChannelsStateInterface> = {
  createChannel: (state: ChannelsStateInterface, payload: Channel) => {
    state.channels.push(payload)
  },

  fetchUserChannels: (state: ChannelsStateInterface, payload: Array<Channel>) => {
    state.channels = payload
  },

  searchPublicChannels: (state: ChannelsStateInterface, payload: Array<Channel>) => {
    state.availableChannels = payload
  },

  removeFromPublicChannels: (state: ChannelsStateInterface, payload: number) => {
    const index = state.availableChannels.map(channel => channel.id).indexOf(payload)

    if(index >= -1) {
      state.availableChannels.splice(index, 1)
    }
  },

  joinChannel: (state: ChannelsStateInterface, payload: Channel) => {
    state.channels.push(payload)
  },

  setActiveChannel: (state: ChannelsStateInterface, payload: Channel) => {
    state.activeChannel = payload
  },

  leaveChannel: (state: ChannelsStateInterface, payload: Channel) => {
    const index = state.channels.map(channel => channel.id).indexOf(payload.id)

    if(index >= -1) {
      state.channels.splice(index, 1)
      
      if(payload.type === ChannelType.Public) {
        state.availableChannels.push(payload)
      }
    }
  }
};

export default mutation;
