<template>
  <q-layout view="lHr LpR lFr">
    <q-header elevated>
      <Header
        :toggleLeftDrawer="toggleLeftDrawer"
        :toggleRightDrawer="toggleRightDrawer"
        :activeChannel="activeChannel?.name"
      />
    </q-header>

    <q-drawer
      v-model="state.isLeftDrawerOpen"
      side="left"
      show-if-above
      bordered
    >
      <LeftDrawer />
    </q-drawer>

    <q-drawer
      show-if-above
      v-model="state.isRightDrawerOpen"
      side="right"
      bordered
    >
      <RightDrawer />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated>
      <MessageForm />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { useStore } from '../store';
import MessageForm from 'src/components/MessageForm.vue';
import Header from 'src/components/Header.vue';
import LeftDrawer from '../components/LeftDrawer.vue';
import RightDrawer from 'src/components/RightDrawer.vue';
import { Channel } from 'src/store/channels/state';

export default defineComponent({
  name: 'MainLayout',

  components: {
    MessageForm,
    Header,
    LeftDrawer,
    RightDrawer,
  },

  setup() {
    const $store = useStore();

    const state = reactive({
      isLeftDrawerOpen: false,
      isRightDrawerOpen: false,
    });

    return {
      state,
      toggleLeftDrawer: () =>
        (state.isLeftDrawerOpen = !state.isLeftDrawerOpen),
      toggleRightDrawer: () =>
        (state.isRightDrawerOpen = !state.isRightDrawerOpen),
      activeChannel: computed(() => $store.state.channels.activeChannel),
      invitations: computed(() => $store.state.channels.invitations),
    };
  },
});
</script>
