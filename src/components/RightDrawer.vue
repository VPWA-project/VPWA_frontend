<template>
  <q-list v-if="activeChannel && amIChannelMember">
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
        :disable="!amIChannelAdmin && activeChannel.type === 'PRIVATE'"
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
          :key="administrator.id"
          v-bind="administrator"
          :show="false"
          :amIAdmin="amIChannelAdmin"
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
          :show="showKickOptionsMenu"
          :amIAdmin="amIChannelAdmin"
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
          v-for="member in offlineUsers"
          :key="member.id"
          v-bind="member"
          :show="showKickOptionsMenu"
          :amIAdmin="amIChannelAdmin"
        />
      </q-list>
    </div>
  </q-list>
</template>

<script lang="ts">
import { Channel, ChannelType, User } from 'src/contracts';
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

    const administrator = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getAdministrator'] as User
    );

    const users = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getOnlineDndUsers'] as User[]
    );

    const offlineUsers = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getOfflineUsers'] as User[]
    );

    const state = reactive({
      isInviteUsersOpen: false,
    });

    const amIChannelAdmin = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/amIChannelAdmin'] as boolean
    );

    const showKickOptionsMenu = computed(() =>
      activeChannel.value?.type === ChannelType.Private &&
      !amIChannelAdmin.value
        ? false
        : true
    );

    return {
      state,
      activeChannel,
      administrator,
      users,
      offlineUsers,
      amIChannelAdmin,

      showInviteUsers: () => (state.isInviteUsersOpen = true),
      amIChannelMember: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['channels_v2/amIChannelMember'] as boolean
      ),
      showKickOptionsMenu
    };
  },
});
</script>
