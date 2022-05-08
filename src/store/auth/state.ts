import { User, ValidationError, ServerError } from 'src/contracts';

export interface AuthStateInterface {
  user: User | null;
  onlyNotifications: boolean;
  status: 'pending' | 'success' | 'error';
  validationErrors: ValidationError[];
  serverError: ServerError | null;
}

function state(): AuthStateInterface {
  return {
    user: null,
    onlyNotifications: false,
    status: 'pending',
    validationErrors: [],
    serverError: null,
  };
}

export default state;
