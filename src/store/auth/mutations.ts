import { ServerError, User, UserStatus, ValidationError } from 'src/contracts';
import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  AUTH_START(state) {
    state.status = 'pending';
    state.validationErrors = [];
    state.serverError = null
  },
  AUTH_SUCCESS(state, user: User | null) {
    state.status = 'success';
    state.user = user;
  },
  AUTH_VALIDATION_ERROR(state, errors: ValidationError[]) {
    state.status = 'error';
    state.validationErrors = errors;
  },
  AUTH_SERVER_ERROR(state, error: ServerError) {
    state.status = 'error'
    state.serverError = error
  },
  CHANGE_STATUS(state, status: UserStatus) {
    if (state.user) {
      state.user.status = status;
    }
  },
  CHANGE_ONLY_NOTIFICATIONS(state, onlyNotifications: boolean) {
    state.onlyNotifications = onlyNotifications
  },
};

export default mutation;
