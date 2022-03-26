<template>
  <q-list v-if="amIChannelMember">
    <q-item>
      <q-item-section>
        <q-item-label class="text-grey-7">Online</q-item-label>
      </q-item-section>
    </q-item>

    <ChannelMember
      v-for="member in online"
      :key="member.id"
      v-bind="member"
      :channelMembers="state.channelMembers"
    />

    <q-item>
      <q-item-section>
        <q-item-label class="text-grey-7">Offline</q-item-label>
      </q-item-section>
    </q-item>

    <ChannelMember
      v-for="member in offline"
      :key="member.id"
      v-bind="member"
      :channelMembers="state.channelMembers"
    />
    <q-item>
      <q-btn
        class="rounded-borders bg-white q-px-sm border-15"
        color="black"
        clickable
        flat
        @click="showInviteUsers"
        icon-right="add_circle"
        label="Invite user"
      />
    </q-item>
    <InviteUsers
      :open="state.isInviteUsersOpen"
      @close="state.isInviteUsersOpen = false"
    />
  </q-list>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { User } from 'src/store/user/state';
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
    const state = reactive({
      channelMembers: [
        {
          id: 1,
          email: '',
          firstname: 'John',
          lastname: 'Doe',
          nickname: 'john',
          status: 'ONLINE',
        },
        {
          id: 2,
          email: '',
          firstname: 'Frank',
          lastname: 'Doe',
          nickname: 'frank',
          status: 'DND',
        },
        {
          id: 3,
          email: '',
          firstname: 'Martin',
          lastname: 'Doe',
          nickname: 'martin',
          status: 'OFFLINE',
        },
      ] as User[],
      isInviteUsersOpen: false,
    });

    return {
      state,
      online: computed(() =>
        state.channelMembers.filter((x) => x.status !== 'OFFLINE')
      ),
      offline: computed(() =>
        state.channelMembers.filter((x) => x.status === 'OFFLINE')
      ),
      showInviteUsers: () => (state.isInviteUsersOpen = true),
      amIChannelMember: computed(() => $store.state.channels.amIChannelMember),
    };
  },
});
</script>
