import { createStore, Store, useStore as baseUseStore } from 'vuex';
import user from './user';
import { UserStateInterface } from './user/state';
import channels from './channels';
import { ChannelsStateInterface } from './channels/state';

export interface StateInterface {
  asd: string;
  user: UserStateInterface;
  channels: ChannelsStateInterface;
}

const store = () => {
  return createStore<StateInterface>({
    modules: {
      user,
      channels,
    },
    strict: !process.env.NODE_ENV,
  });
};

export const useStore = (): Store<StateInterface> => {
  return baseUseStore<StateInterface>();
};

export default store;
