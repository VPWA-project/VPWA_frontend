import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface } from './state';

const getters: GetterTree<UserStateInterface, StateInterface> = {
  userGetter(state): string | undefined {
    return state.loggedInUser?.firstname
  },
};

export default getters;
