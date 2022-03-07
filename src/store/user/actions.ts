import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface } from './state';
import { UserStatePayload } from './types';
import { UserRegisterPayload } from './types';

const actions: ActionTree<UserStateInterface, StateInterface> = {
  loginUser(context, payload: UserStatePayload) {
    // TODO poslat email a password z payload.email a payload.password na server
    setTimeout(function () {
      context.commit('loginUser', payload);
    }, 2000);
  },
  // TODO poslat vsetky udaje z payload na server
  registerUser(context, payload: UserRegisterPayload) {
    setTimeout(function () {
      context.commit('registerUser', payload);
    }, 2000);
  },
  changeUserStatus(context, payload: string) {
    context.commit('changeUserStatus', payload);
  },
};

export default actions;
