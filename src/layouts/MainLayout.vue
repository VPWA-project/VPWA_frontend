<template>
  <q-layout view="lHr LpR lFr">
    <q-header class="rounded-borders bg-cyan-9 q-px-sm q-mx-sm border-15">
      <Header
        :toggleLeftDrawer="toggleLeftDrawer"
        :toggleRightDrawer="toggleRightDrawer"
      />
    </q-header>

    <q-drawer
      v-model="state.isLeftDrawerOpen"
      side="left"
      show-if-above
      style="border-radius: 0px 15px 15px 0px"
      class="bg-blue-grey-2"
    >
      <LeftDrawer />
    </q-drawer>

    <q-drawer
      show-if-above
      v-model="state.isRightDrawerOpen"
      side="right"
      style="border-radius: 15px 0px 0px 15px"
      class="bg-blue-grey-2"
    >
      <RightDrawer />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-white">
      <Footer />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import Header from 'src/components/Header.vue';
import LeftDrawer from '../components/LeftDrawer.vue';
import RightDrawer from 'src/components/RightDrawer.vue';
import Footer from 'src/components/Footer.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    Header,
    LeftDrawer,
    RightDrawer,
    Footer
},

  setup() {
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
    };
  },
});
</script>
