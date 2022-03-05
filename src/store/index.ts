import { createStore, Store, useStore as baseUseStore } from 'vuex';
import userModule from './user';
import { UserStateInterface } from './user/state';

export interface StateInterface {
  asd: string;
  user: UserStateInterface;
}

const store = () => {
    return createStore<StateInterface>({
      modules: {
          userModule
      },
      strict: !process.env.NODE_ENV,
    });
}

export const useStore = (): Store<StateInterface> => {
  return baseUseStore<StateInterface>();
};

export default store;