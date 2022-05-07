<template>
  <q-menu
    anchor="bottom middle"
    self="top middle"
    class="bg-grey-2"
    style="
      border-radius: 15px;
      overflow: auto;
      min-width: 268px;
      max-width: 268px;
    "
  >
    <q-list>
      <q-item class="no-padding">
        <q-item-label class="q-pa-md text-grey-7">Your status</q-item-label>
      </q-item>

      <div class="column q-mx-md q-gutter-y-xs">
        <q-item
          clickable
          @click="changeUserStatus(UserStatus.Online)"
          class="border-15 bg-white"
        >
          <q-item-section avatar>
            <q-badge color="green" rounded />
          </q-item-section>
          <q-item-section>
            <q-item-label>Online</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="changeUserStatus(UserStatus.DND)"
          class="border-15 bg-white"
        >
          <q-item-section avatar>
            <q-badge color="red" rounded />
          </q-item-section>
          <q-item-section>
            <q-item-label>DND</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="changeUserStatus(UserStatus.OFFLINE)"
          class="border-15 bg-white"
        >
          <q-item-section avatar>
            <q-badge color="black" rounded />
          </q-item-section>
          <q-item-section>
            <q-item-label>Offline</q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <q-separator spaced inset />

      <q-item class="no-padding">
        <q-item-label class="q-pa-md text-grey-7"
          >Notification settings</q-item-label
        >
      </q-item>

      <q-item tag="label" v-ripple class="border-15 q-mx-md bg-white q-mx-xs">
        <q-item-section>
          <q-item-label>Only @mentions</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle
            @click="changeOnlyNotifications"
            color="cyan-9"
            v-model="onlyNotifications"
          />
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item
        clickable
        @click="logout()"
        class="border-15 bg-white q-mx-md q-mb-md"
      >
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
import { User, UserStatus } from 'src/contracts';
import { useStore } from 'src/store';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const $store = useStore();

    const onlyNotifications = computed({
      get() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const user = $store.getters['auth/getAuthenticatedUser'] as User | null;
        return user ? user.onlyNotifications : false;
      },
      set() {
        return
      },
    });

    return {
      UserStatus,
      onlyNotifications,
      changeUserStatus: async (status: UserStatus) => {
        await $store.dispatch('auth/changeUserStatus', status).catch(console.log);
        // if (status === UserStatus.OFFLINE) {
        //   await $store.dispatch('channels_v2/offline').catch(console.log);
        // } else {
        //   await $store.dispatch('channels_v2/onlineDnd').catch(console.log);
        // }
      },
      logout: async () => {
        await $store.dispatch('auth/logout');
        await $store.dispatch('channels_v2/leave');
      },
      changeOnlyNotifications: () => $store.dispatch('auth/update', !onlyNotifications.value),
    };
  },
});
</script>
