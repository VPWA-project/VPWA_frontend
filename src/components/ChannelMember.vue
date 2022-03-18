<template>
  <UserBanner
    :firstname="firstname"
    :lastname="lastname"
    :nickname="nickname"
    :status="status"
  >
    <template v-slot:append>
      <q-item-section avatar>
        <q-btn flat class="no-border" icon="more_vert">
          <q-menu fit>
            <q-list style="width: 150px">
              <q-item clickable @click="kickUser(id)">
                <q-item-section>Kick</q-item-section>
              </q-item>
              <q-item clickable @click="banUser(id)">
                <q-item-section>Ban</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-item-section>
    </template>
  </UserBanner>
</template>

<script lang="ts">
import UserBanner from './UserBanner.vue';
import { User } from 'src/store/user/state';

import { defineComponent, PropType, toRef } from 'vue';

export default defineComponent({
  props: {
    id: {
      type: Number,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    channelMembers: {
      type: Array as PropType<Array<User>>,
      required: true,
    },
  },
  components: {
    UserBanner,
  },
  setup(props) {
    const channelMembers = toRef(props, 'channelMembers');

    const kickUser = (id: number) => {
      const index = channelMembers.value.map((member) => member.id).indexOf(id);

      if (index > -1) {
        channelMembers.value.splice(index, 1);
      }
    };

    const banUser = (id: number) => {
      const index = channelMembers.value.map((member) => member.id).indexOf(id);

      if (index > -1) {
        channelMembers.value.splice(index, 1);
      }
    };

    return {
      kickUser,
      banUser,
    };
  },
});
</script>
