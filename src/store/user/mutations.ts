import { MutationTree } from 'vuex';
import { UserStateInterface } from './state';

const mutation: MutationTree<UserStateInterface> = {
  someMutation(/* state: UserStateInterface */) {
    // your code
  },
};

export default mutation;
