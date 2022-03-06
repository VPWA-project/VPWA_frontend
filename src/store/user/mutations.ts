import { MutationTree } from 'vuex';
import { UserStateInterface } from './state';
import { UserRegisterPayload, UserStatePayload } from './types';

const mutation: MutationTree<UserStateInterface> = {
  loginUser(state: UserStateInterface, payload: UserStatePayload) {
    // TODO
    state.email = payload.email;
  },
  registerUser(state: UserStateInterface, payload: UserRegisterPayload) {
    state.firstname = payload.firstname;
    state.lastname = payload.lastname;
    state.nickname = payload.nickname;
    state.email = payload.email;
  },
};

export default mutation;
