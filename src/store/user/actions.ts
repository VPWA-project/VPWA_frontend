import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface, UserStatus } from './state';
import { UserLoginPayload } from './types';
import { UserRegisterPayload } from './types';

const actions: ActionTree<UserStateInterface, StateInterface> = {
  loginUser(context, payload: UserLoginPayload) {
    // TODO poslat email a password z payload.email a payload.password na server

    if (
      payload.email !== 'jozino@gmail.com' ||
      payload.password !== '12345678'
    ) {
      return false
    } 
    
    context.commit('loginUser', payload);
    return true
  },
  // TODO poslat vsetky udaje z payload na server
  registerUser(context, payload: UserRegisterPayload) {
    setTimeout(function () {
      context.commit('registerUser', payload);
    }, 2000);
  },
  changeUserStatus(context, payload: UserStatus) {
    context.commit('changeUserStatus', payload);
  },
};

export default actions;
