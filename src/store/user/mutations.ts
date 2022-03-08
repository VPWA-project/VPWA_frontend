import { MutationTree } from 'vuex';
import { User, UserStateInterface, UserStatus } from './state';
import { UserRegisterPayload, UserStatePayload } from './types';

const mutation: MutationTree<UserStateInterface> = {
  loginUser(state: UserStateInterface, payload: UserStatePayload) {
    // TODO
    if(!state.loggedInUser) state.loggedInUser = {
      id: 1,
      firstname: '',
      lastname: '',
      status: UserStatus.Online,
      nickname: '',
      email: payload.email
    }
  },
  registerUser(state: UserStateInterface, payload: UserRegisterPayload) {
    
    const user: User = {
      id: Math.floor(Math.random() * 10),
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
      nickname: payload.nickname,
      status: UserStatus.Online
    }

    state.loggedInUser = user
  },
};

export default mutation;
