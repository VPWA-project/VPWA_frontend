import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { InvitationsStateInterface } from './state';

const getters: GetterTree<InvitationsStateInterface, StateInterface> = {
  getInvitations(context) {
    return Object.values(context.invitations)
  },
  isSubmitting(context) {
    return context.isSubmitting
  },
  getUserOptions(context) {
    return context.userOptions
  }
};

export default getters;
