import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import { authService, authManager, activityService } from 'src/services';
import {
  LoginRequest,
  RegisterRequest,
  UserStatus,
  ValidationErrorResponse,
} from 'src/contracts';
import { AxiosError } from 'axios';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async check({ commit }) {
    try {
      commit('AUTH_START');
      const user = await authService.me();
      commit('AUTH_SUCCESS', user);
      return user !== null;
    } catch (err) {
      commit('AUTH_ERROR', err);
      throw err;
    }
  },
  async register({ commit }, form: RegisterRequest) {
    try {
      commit('AUTH_START');
      const response = await authService.register(form);
      commit('AUTH_SUCCESS', null);

      authManager.setToken(response.token.token);
      return response;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status == 422) {
        const errors = error.response?.data as ValidationErrorResponse;
        commit('AUTH_ERROR', errors.errors);
      }

      throw err;
    }
  },
  async login({ commit }, credentials: LoginRequest) {
    try {
      commit('AUTH_START');
      const apiToken = await authService.login(credentials);
      commit('AUTH_SUCCESS', null);
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token);
      return apiToken;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status == 422) {
        const errors = error.response.data as ValidationErrorResponse;
        commit('AUTH_ERROR', errors.errors);
      }

      throw err;
    }
  },
  async logout({ commit, dispatch }) {
    try {
      commit('AUTH_START');
      await authService.logout();
      await dispatch('channels/leave', null, { root: true });
      commit('AUTH_SUCCESS', null);
      // remove api token and notify listeners
      authManager.removeToken();
    } catch (err) {
      commit('AUTH_ERROR', err);
      throw err;
    }
  },
  changeUserStatus({ commit }, status: UserStatus) {
    commit('CHANGE_STATUS', status);
    void activityService.changeStatus(status);
  },

  async update({ commit }, onlyNotifications: boolean) {
    const user = await authService.update({ onlyNotifications });
    commit('CHANGE_ONLY_NOTIFICATIONS', user.onlyNotifications);
  },
};

export default actions;
