import { MutationTree } from 'vuex';
import { GuiStateInterface } from './state';

const mutation: MutationTree<GuiStateInterface> = {
  SET_RIGHT_DRAWER(state, status: boolean) {
    state.rightDrawerOpen = status
  }
};

export default mutation;
