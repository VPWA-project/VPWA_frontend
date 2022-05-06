import { createStore, Store, useStore as baseUseStore } from 'vuex';
import auth from './auth';
import type { AuthStateInterface } from './auth/state';
import channels_v2 from './channels_v2';
import { ChannelsV2StateInterface } from './channels_v2/state';
import createChannel from './createChannel';
import { CreateChannelStateInterface } from './createChannel/state';
import invitations from './invitations';
import { InvitationsStateInterface } from './invitations/state';
import searchChannels from './searchChannels';
import { SearchChannelsStateInterface } from './searchChannels/state';
import gui from './gui';
import { GuiStateInterface } from './gui/state';
import { InjectionKey } from 'vue';

export interface StateInterface {
  auth: AuthStateInterface;
  channels_v2: ChannelsV2StateInterface;
  createChannel: CreateChannelStateInterface;
  invitations: InvitationsStateInterface;
  searchChannels: SearchChannelsStateInterface;
  gui: GuiStateInterface;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<StateInterface>;
  }
}

export const storeKey: InjectionKey<Store<StateInterface>> = Symbol('vuex-key');

const store = () => {
  return createStore<StateInterface>({
    modules: {
      auth,
      channels_v2,
      createChannel,
      invitations,
      searchChannels,
      gui,
    },
    strict: !process.env.NODE_ENV,
  });
};

export const useStore = (): Store<StateInterface> => {
  return baseUseStore<StateInterface>(storeKey);
};

export default store;
