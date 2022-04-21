import { createStore, Store, useStore as baseUseStore } from 'vuex';
import auth from './auth';
import type { AuthStateInterface } from './auth/state';
import channels_v2 from './channels_v2';
import { ChannelsV2StateInterface } from './channels_v2/state';
import createChannel from './createChannel';
import { CreateChannelStateInterface } from './createChannel/state';
import invitations from './invitations';
import { InvitationsStateInterface } from './invitations/state';

export interface StateInterface {
  auth: AuthStateInterface;
  channels_v2: ChannelsV2StateInterface;
  createChannel: CreateChannelStateInterface;
  invitations: InvitationsStateInterface;
}

const store = () => {
  return createStore<StateInterface>({
    modules: {
      auth,
      channels_v2,
      createChannel,
      invitations,
    },
    strict: !process.env.NODE_ENV,
  });
};

export const useStore = (): Store<StateInterface> => {
  return baseUseStore<StateInterface>();
};

export default store;
