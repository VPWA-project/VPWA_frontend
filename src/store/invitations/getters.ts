import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { InvitationsStateInterface } from './state';

const getters: GetterTree<InvitationsStateInterface, StateInterface> = {
  getInvitations(context) {
    return context.invitations
  },
  isSubmitting(context) {
    return context.isSubmitting
  }
};

export default getters;
