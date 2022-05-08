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
  getValidationErrors(context) {
    return context.validationErrors;
  },
  getServerError(context) {
    return context.serverError;
  },
  getOnlyNotifications(context) {
    return context.onlyNotifications
  }
};

export default getters;
