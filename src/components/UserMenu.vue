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
          class="border-all-15 bg-white"
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
          @click="changeUserStatus(UserStatus.Dnd)"
          class="border-all-15 bg-white"
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
          @click="changeUserStatus(UserStatus.Offline)"
          class="border-all-15 bg-white"
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

      <q-item
        tag="label"
        v-ripple
        class="border-all-15 q-mx-md bg-white q-mx-xs"
      >
        <q-item-section>
          <q-item-label>Only @mentions</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="cyan-9" v-model="state.allowOnlyMentions" />
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item clickable class="border-all-15 bg-white q-mx-md q-mb-md">
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

export default defineComponent({
  setup() {
    const $store = useStore();

    const state = reactive({
      allowOnlyMentions: false,
    });

    return {
      state,
      UserStatus,
      changeUserStatus: (status: UserStatus) =>
        $store.dispatch('user/changeUserStatus', status).catch(console.log),
    };
  },
});
</script>

<style scoped>
.border-all-15 {
  border-radius: 15px;
}
</style>
