import { ValidationError } from 'src/contracts';

export interface CreateChannelStateInterface {
  submitStatus: 'pending' | 'success' | 'error';
  isSubmitting: boolean;
  errors: ValidationError[];
}

function state(): CreateChannelStateInterface {
  return {
    submitStatus: 'pending',
    isSubmitting: false,
    errors: [],
  };
}

export default state;
