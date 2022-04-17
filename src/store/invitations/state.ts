import { Invitation } from 'src/contracts';

export interface InvitationsStateInterface {
  invitations: Invitation[];
}

function state(): InvitationsStateInterface {
  return {
    invitations: [],
  };
}

export default state;
