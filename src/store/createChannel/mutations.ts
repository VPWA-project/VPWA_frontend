import { ServerError, ValidationError } from 'src/contracts';
import { MutationTree } from 'vuex';
import { CreateChannelStateInterface } from './state';

const mutation: MutationTree<CreateChannelStateInterface> = {
  SUBMIT_START(state) {
    state.submitStatus = 'pending';
    state.isSubmitting = true
    state.validationErrors = [];
    state.serverError = null
  },
  SUBMIT_SUCCESS(state) {
    state.submitStatus = 'success';
    state.isSubmitting = false
  },
  SUBMIT_VALIDATION_ERRORS(state, errors: ValidationError[]) {
    state.submitStatus = 'error';
    state.isSubmitting = false
    state.validationErrors = errors;
  },
  SUBMIT_SERVER_ERROR(state, error: ServerError) {
    state.submitStatus = 'error'
    state.isSubmitting = false
    state.serverError = error
  }
};

export default mutation;
