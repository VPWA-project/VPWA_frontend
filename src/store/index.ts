import { createStore, Store, useStore as baseUseStore } from 'vuex';
import userModule from './user';
import { UserStateInterface } from './user/state';
import channelModule from './channels'
import { ChannelStateInterface } from './channels/state';

export interface StateInterface {
  asd: string;
  user: UserStateInterface;
  channels: Array<ChannelStateInterface>;
}

const store = () => {
    return createStore<StateInterface>({
      modules: {
        userModule,
        channelModule,
      },
      strict: !process.env.NODE_ENV,
    });
}

export const useStore = (): Store<StateInterface> => {
  return baseUseStore<StateInterface>();
};

export default store;