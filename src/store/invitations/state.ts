import { Invitation } from 'src/contracts';

export interface InvitationsStateInterface {
  invitations: Invitation[];
  isSubmitting: boolean;
  errors: Error | null
}

function state(): InvitationsStateInterface {
  return {
    invitations: [],
    isSubmitting: false,
    errors: null
  };
}

export default state;
