import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import { authService, authManager } from 'src/services';
import {
  LoginCredentials,
  RegisterData,
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
  async register({ commit }, form: RegisterData) {
    try {
      commit('AUTH_START');
      const user = await authService.register(form);
      commit('AUTH_SUCCESS', null);
      return user;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status == 422) {
        const errors = error.response?.data as ValidationErrorResponse;
        commit('AUTH_ERROR', errors.errors);
      }

      throw err;
    }
  },
  async login({ commit }, credentials: LoginCredentials) {
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
  async logout({ commit }) {
    try {
      commit('AUTH_START');
      await authService.logout();
      commit('AUTH_SUCCESS', null);
      // remove api token and notify listeners
      authManager.removeToken();
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status == 422) {
        const errors = error.response.data as ValidationErrorResponse;
        commit('AUTH_ERROR', errors.errors);
      }

      throw err;
    }
  },
};

export default actions;
