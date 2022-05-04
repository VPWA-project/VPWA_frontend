import { User, UserStatus } from 'src/contracts';
import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  AUTH_START(state) {
    state.status = 'pending';
    state.errors = [];
  },
  AUTH_SUCCESS(state, user: User | null) {
    state.status = 'success';
    state.user = user;
  },
  AUTH_ERROR(state, errors: []) {
    state.status = 'error';
    state.errors = errors;
  },
  CHANGE_STATUS(state, status: UserStatus) {
    if (state.user) {
      state.user.status = status;
    }
  },
  CHANGE_ONLY_NOTIFICATIONS(state, onlyNotifications: boolean) {
    if (state.user) state.user.onlyNotifications = onlyNotifications;
  },
};

export default mutation;
