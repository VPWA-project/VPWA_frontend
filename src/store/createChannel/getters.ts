import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CreateChannelStateInterface } from './state';

const getters: GetterTree<CreateChannelStateInterface, StateInterface> = {
  isSubmitting(context) {
    return context.isSubmitting;
  },
  getServerError(context) {
    return context.serverError;
  },
  getValidationErrors(context) {
    return context.validationErrors;
  },
};

export default getters;
