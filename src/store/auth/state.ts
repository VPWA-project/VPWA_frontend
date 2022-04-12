import { User, ValidationError } from 'src/contracts';

export interface AuthStateInterface {
  user: User | null;
  status: 'pending' | 'success' | 'error';
  errors: ValidationError[]
}

function state(): AuthStateInterface {
  return {
    user: null,
    status: 'pending',
    errors: [],
  };
}

export default state;
