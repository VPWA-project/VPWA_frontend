import { Invitation, User } from 'src/contracts';

export interface InvitationsStateInterface {
  invitations: Invitation[];
  isSubmitting: boolean;
  errors: Error | null;
  userOptions: User[]
}

function state(): InvitationsStateInterface {
  return {
    invitations: [],
    isSubmitting: false,
    errors: null,
    userOptions: []
  };
}

export default state;
