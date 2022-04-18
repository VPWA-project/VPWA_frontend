import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  isAuthenticated(context) {
    return context.user !== null;
  },
  getAuthenticatedUser(context) {
    return context.user;
  },
};

export default getters;
