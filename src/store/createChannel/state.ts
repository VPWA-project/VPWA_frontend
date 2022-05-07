import { ServerError, ValidationError } from 'src/contracts';

export interface CreateChannelStateInterface {
  submitStatus: 'pending' | 'success' | 'error';
  isSubmitting: boolean;
  validationErrors: ValidationError[];
  serverError: ServerError | null
}

function state(): CreateChannelStateInterface {
  return {
    submitStatus: 'pending',
    isSubmitting: false,
    validationErrors: [],
    serverError: null
  };
}

export default state;
