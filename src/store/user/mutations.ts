import { MutationTree } from 'vuex';
import { StatusType, UserStateInterface } from './state';
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
  changeUserStatus(state: UserStateInterface, payload: string) {
    if (payload == 'ONLINE') {
      state.status = StatusType.Online;
    } else if (payload == 'DND') {
      state.status = StatusType.Dnd;
    } else if (payload == 'OFFLINE') {
      state.status = StatusType.Offline;
    }
  },
};

export default mutation;
