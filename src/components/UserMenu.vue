<template>
  <q-menu fit anchor="bottom left" self="top left">
    <q-list>
      <q-item class="no-padding">
        <q-item-label class="q-pa-md text-grey-7">Your status</q-item-label>
      </q-item>

      <q-item clickable @click="changeUserStatus(UserStatus.Online)">
        <q-item-section avatar>
          <q-badge color="green" rounded />
        </q-item-section>
        <q-item-section>
          <q-item-label>Online</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable @click="changeUserStatus(UserStatus.Dnd)">
        <q-item-section avatar>
          <q-badge color="red" rounded />
        </q-item-section>
        <q-item-section>
          <q-item-label>DND</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable @click="changeUserStatus(UserStatus.Offline)">
        <q-item-section avatar>
          <q-badge color="black" rounded />
        </q-item-section>
        <q-item-section>
          <q-item-label>Offline</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item class="no-padding">
        <q-item-label class="q-pa-md text-grey-7"
          >Notification settings</q-item-label
        >
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Only @mentions</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="state.allowOnlyMentions" />
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item clickable @click="logout()">
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Logout</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { UserStatus } from 'src/store/user/state';
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const $store = useStore();
    const router = useRouter();

    const state = reactive({
      allowOnlyMentions: false,
    });

    return {
      state,
      UserStatus,
      changeUserStatus: (status: UserStatus) =>
        $store.dispatch('user/changeUserStatus', status).catch(console.log),
      logout: () => {
        // TODO: logout
        router.push({ name: 'account' }).catch(console.log);
      },
    };
  },
});
</script>
