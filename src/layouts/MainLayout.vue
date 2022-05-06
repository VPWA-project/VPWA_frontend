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
      v-model="isRightDrawerOpen"
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
import { computed, defineComponent, onMounted, reactive, watch } from 'vue';
import HeaderWrapper from 'src/components/HeaderWrapper.vue';
import LeftDrawer from '../components/LeftDrawer.vue';
import RightDrawer from 'src/components/RightDrawer.vue';
import FooterWrapper from 'src/components/FooterWrapper.vue';
import { useStore } from 'src/store';
import { Channel, Invitation, ChannelType } from 'src/contracts';
import { useRoute, useRouter } from 'vue-router';

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
    });

    const $store = useStore();
    const route = useRoute();
    const $router = useRouter();

    const isRightDrawerOpen = computed({
      get() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return $store.getters['gui/isRightDrawerOpen'] as boolean;
      },
      set(newValue: boolean) {
        $store.dispatch('gui/setRightDrawer', newValue).catch(console.log);
      },
    });

    const amIChannelMember = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/amIChannelMember'] as boolean
    );
    const activeChannel = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
    );

    const invitations = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['invitations/getInvitations'] as Invitation[]
    );

    const setActiveChannel = (name: string) => {
      $store
        .dispatch('channels_v2/setActiveChannel', name)
        .then(async (channel: Channel) => {
          if (amIChannelMember.value) {
            await $store.dispatch('channels_v2/tryJoin', name);
          } else if (activeChannel.value?.type === ChannelType.Private) {
            const hasInvitation = !!invitations.value.find(
              (invitation) => invitation.channelId === channel.id
            );

            if (!hasInvitation) {
              await $router.push({ name: '404' });
            }
          }
        })
        .catch(async () => await $router.push({ name: '404' }));
    };

    watch(
      () => route.params.name,
      (name) => {
        setActiveChannel(name as string);
      }
    );

    onMounted(async () => {
      await $store
        .dispatch('channels_v2/getUserChannels')
        .then((channels: Channel[]) => {
          channels.forEach((channel) => {
            $store
              .dispatch('channels_v2/getChannelUsers', {
                channelId: channel.id,
                channelName: channel.name,
              })
              .catch(console.log);
          });
        })
        .catch(console.log);
      await $store
        .dispatch('invitations/getUserInvitations')
        .catch(console.log);
      setActiveChannel(route.params.name as string);
    });

    return {
      state,
      toggleLeftDrawer: () =>
        (state.isLeftDrawerOpen = !state.isLeftDrawerOpen),
      toggleRightDrawer: () =>
        (isRightDrawerOpen.value = !isRightDrawerOpen.value),
      isRightDrawerOpen,
    };
  },
});
</script>
