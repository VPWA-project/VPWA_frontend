<template>
  <div class="row q-ma-md q-py-md q-px-md bg-grey-2 border-15 rounded-borders">
    <q-item-section avatar>
      <q-avatar rounded color="cyan-8" text-color="white">
        {{ nameInitials }}
        <q-badge v-if="userStatus" :color="userStatus" rounded floating
      /></q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-subtitle1">{{ userName }}</q-item-label>
      <q-item-label caption>{{ userNickName }}</q-item-label>
    </q-item-section>
    <slot name="append"></slot>
  </div>
</template>

<script lang="ts">
import { UserStatus } from 'src/store/user/state';
import { defineComponent, computed, toRefs } from 'vue';

export default defineComponent({
  props: {
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
    status: String,
  },
  setup(props) {
    const { firstname, lastname, nickname, status } = toRefs(props);

    return {
      userStatus: computed(() => {
        if (status.value === UserStatus.Online) {
          return 'green';
        }
        if (status.value === UserStatus.Dnd) {
          return 'red';
        }
        if (status.value === UserStatus.Offline) {
          return 'black';
        }
        return 'green';
      }),

      nameInitials: computed(
        () =>
          firstname.value.charAt(0).toUpperCase() +
          lastname.value.charAt(0).toUpperCase()
      ),

      userNickName: computed(() => '@' + nickname.value),

      userName: computed(() => firstname.value + ' ' + lastname.value),
    };
  },
});
</script>