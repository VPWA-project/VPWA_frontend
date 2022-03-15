<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <Header
        :toggleLeftDrawer="toggleLeftDrawer"
        :activeChannel="activeChannel?.name"
      />
    </q-header>

    <q-drawer v-model="state.isLeftDrawerOpen" show-if-above bordered>
      <LeftDrawer />
    </q-drawer>

    <q-drawer
      show-if-above
      v-model="state.isrightDrawerOpen"
      side="right"
      bordered
    >
      <RightDrawer />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
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
      isrightDrawerOpen: false,
    });

    return {
      state,
      toggleLeftDrawer: () =>
        (state.isLeftDrawerOpen = !state.isLeftDrawerOpen),
      activeChannel: computed(() => $store.state.channels.activeChannel),
      invitations: computed(() => $store.state.channels.invitations),
    };
  },
});
</script>
