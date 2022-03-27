import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { User, UserStateInterface } from './state';

const getters: GetterTree<UserStateInterface, StateInterface> = {
  getLoggedInUser: (state): User | undefined => {
    return state.loggedInUser
  }
};

export default getters;
