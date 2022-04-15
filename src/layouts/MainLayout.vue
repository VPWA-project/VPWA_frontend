<template>
  <q-layout view="lHr LpR lFr">
    <q-header class="bg-cyan-9 q-px-sm q-mx-sm border-15">
      <HeaderWrapper
        :toggleLeftDrawer="toggleLeftDrawer"
        :toggleRightDrawer="toggleRightDrawer"
      />
    </q-header>

    <q-drawer
      v-model="state.isLeftDrawerOpen"
      side="left"
      show-if-above
      :breakpoint="1440"
      style="border-radius: 0px 15px 15px 0px"
      class="bg-blue-grey-2"
    >
      <LeftDrawer />
    </q-drawer>

    <q-drawer
      show-if-above
      :breakpoint="1440"
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
      <FooterWrapper />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import HeaderWrapper from 'src/components/HeaderWrapper.vue';
import LeftDrawer from '../components/LeftDrawer.vue';
import RightDrawer from 'src/components/RightDrawer.vue';
import FooterWrapper from 'src/components/FooterWrapper.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    HeaderWrapper,
    LeftDrawer,
    RightDrawer,
    FooterWrapper,
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
