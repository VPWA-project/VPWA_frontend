<template>
  <q-list v-if="activeChannel">
    <q-item class="q-mt-sm column">
      <q-item-label class="text-weight-medium text-subtitle1"
        >Channel members</q-item-label
      >
      <q-btn
        class="bg-white q-mt-md q-px-sm border-15"
        color="black"
        clickable
        flat
        @click="showInviteUsers"
        icon-right="add_circle"
        label="Invite users"
      />
    </q-item>
    <InviteUsers
      :open="state.isInviteUsersOpen"
      @close="state.isInviteUsersOpen = false"
    />

    <div class="q-ma-md q-py-md bg-grey-2 border-15">
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium text-subtitle1"
            >Administrator</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-list>
        <ChannelMember
          background="bg-white"
          :key="activeChannel.administrator.id"
          v-bind="activeChannel.administrator"
        />
      </q-list>
    </div>

    <div class="q-ma-md q-py-md bg-grey-2 border-15">
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium text-subtitle1"
            >Online</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-list>
        <ChannelMember
          background="bg-white"
          v-for="member in users"
          :key="member.id"
          v-bind="member"
          :status="member.status"
        />
      </q-list>
    </div>

    <div class="q-ma-md q-py-md bg-grey-2 border-15">
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium text-subtitle1"
            >Offline</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-list>
        <ChannelMember
          background="bg-white"
          v-for="member in offlineUser"
          :key="member.id"
          v-bind="member"
        />
      </q-list>
    </div>
  </q-list>
</template>

<script lang="ts">
import { Channel, User } from 'src/contracts';
import { useStore } from 'src/store';
import { defineComponent, computed, reactive } from 'vue';
import ChannelMember from './ChannelMember.vue';
import InviteUsers from './InviteUsers.vue';

export default defineComponent({
  components: {
    ChannelMember,
    InviteUsers,
  },
  setup() {
    const $store = useStore();

    const activeChannel = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
    );

    const onlineUsers = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getOnlineUsers'] as User[]
    );

    const dndUsers = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getDndUsers'] as User[]
    );

    const offlineUsers = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getOfflineUsers'] as User[]
    );

    const users = computed(() => [...onlineUsers.value, ...dndUsers.value]);

    const state = reactive({
      isInviteUsersOpen: false,
    });

    return {
      state,
      activeChannel,
      users,
      offlineUsers,

      showInviteUsers: () => (state.isInviteUsersOpen = true),
      amIChannelMember: computed(() => true),
    };
  },
});
</script>
