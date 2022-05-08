import { Invitation, ServerError, User } from 'src/contracts';

export interface InvitationsStateInterface {
  invitations: {[invitationId: string]: Invitation};
  isSubmitting: boolean;
  error: ServerError | null;
  userOptions: User[]
}

function state(): InvitationsStateInterface {
  return {
    invitations: {},
    isSubmitting: false,
    error: null,
    userOptions: []
  };
}

export default state;
