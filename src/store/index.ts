import { createStore, Store, useStore as baseUseStore } from 'vuex';
import user from './user';
import { UserStateInterface } from './user/state';
import channels from './channels';
import { ChannelsStateInterface } from './channels/state';
import auth from './auth';
import type { AuthStateInterface } from './auth/state'
import channels_v2 from './channels_v2'
import { ChannelsV2StateInterface } from './channels_v2/state';

export interface StateInterface {
  asd: string;
  user: UserStateInterface;
  channels: ChannelsStateInterface;
  auth: AuthStateInterface;
  channels_v2: ChannelsV2StateInterface
}

const store = () => {
  return createStore<StateInterface>({
    modules: {
      user,
      channels,
      auth,
      channels_v2,
    },
    strict: !process.env.NODE_ENV,
  });
};

export const useStore = (): Store<StateInterface> => {
  return baseUseStore<StateInterface>();
};

export default store;
