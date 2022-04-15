import { ValidationError } from 'src/contracts';
import { MutationTree } from 'vuex';
import { CreateChannelStateInterface } from './state';

const mutation: MutationTree<CreateChannelStateInterface> = {
  SUBMIT_START(state) {
    state.submitStatus = 'pending';
    state.isSubmitting = true
    state.errors = [];
  },
  SUBMIT_SUCCESS(state) {
    state.submitStatus = 'success';
    state.isSubmitting = false
    // TODO: add channel to my channels
  },
  SUBMIT_ERROR(state, errors: ValidationError[]) {
    state.submitStatus = 'error';
    state.isSubmitting = false
    state.errors = errors;
  },
};

export default mutation;
