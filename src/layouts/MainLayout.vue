<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <Header
        :toggleLeftDrawer="toggleLeftDrawer"
        :activeChannel="activeChannel?.name"
      />
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <LeftDrawer />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label class="text-grey-7">Online</q-item-label>
          </q-item-section>
        </q-item>

        <UserBanner
          firstname="Frido"
          lastname="Herak"
          nickname="cigan123"
          status="ONLINE"
        />

        <q-item>
          <q-item-section>
            <q-item-label class="text-grey-7">Offline</q-item-label>
          </q-item-section>
        </q-item>

        <UserBanner
          firstname="Frido"
          lastname="Herak"
          nickname="cigan123"
          status="OFFLINE"
        />
      </q-list>
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
import { computed, defineComponent, ref } from 'vue';
import { useStore } from '../store';
import ChannelLink from 'src/components/ChannelLink.vue';
import SearchChannels from 'src/components/SearchChannels.vue';
import {
  Channel,
  InvitationState,
  InvitationInfo,
} from 'src/store/channels/state';
import { UserStatus } from 'src/store/user/state';
import MessageForm from 'src/components/MessageForm.vue';
import UserBanner from '../components/UserBanner.vue';
import Header from 'src/components/Header.vue';
import UserMenu from 'src/components/UserMenu.vue';
import LeftDrawer from '../components/LeftDrawer.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    MessageForm,
    UserBanner,
    Header,
    LeftDrawer,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const browseChannelsOpen = ref(false);
    const allowOnlyMentions = ref(true);

    const btnIcon = ref('expand_more');

    const $store = useStore();

    return {
      btnIcon,
      message: '',
      leftDrawerOpen,
      rightDrawerOpen,
      browseChannelsOpen,
      allowOnlyMentions,
      confirm: ref(false),
      user: computed(() => $store.state.user),
      UserStatus,
      InvitationState,

      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      /*
      userGetter: computed<string>(() => {
        return $store.getters.userGetter;
      }),
      */
      activeChannel: computed(() => {
        return $store.state.channels.activeChannel;
      }),
      invitations: computed(() => {
        return $store.state.channels.invitations;
      }),
    };
  },
});
</script>
