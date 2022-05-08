import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GuiStateInterface } from './state';

const getters: GetterTree<GuiStateInterface, StateInterface> = {
  isRightDrawerOpen(context) {
    return context.rightDrawerOpen;
  },
};

export default getters;
