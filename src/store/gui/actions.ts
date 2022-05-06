import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GuiStateInterface } from './state';

const actions: ActionTree<GuiStateInterface, StateInterface> = {
  setRightDrawer({commit}, state: boolean) {
    commit('SET_RIGHT_DRAWER', state)
  }
};

export default actions;
