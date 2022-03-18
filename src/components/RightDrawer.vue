<template>
  <q-list>
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
  </q-list>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from 'vue';
import ChannelMember from './ChannelMember.vue';

export default defineComponent({
  components: {
    ChannelMember,
  },
  setup() {
    const state = reactive({
      channelMembers: [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          nickname: 'john',
          status: 'ONLINE',
        },
        {
          id: 2,
          firstname: 'Frank',
          lastname: 'Doe',
          nickname: 'frank',
          status: 'DND',
        },
        {
          id: 3,
          firstname: 'Martin',
          lastname: 'Doe',
          nickname: 'martin',
          status: 'OFFLINE',
        },
      ],
    });

    return {
      state,
      online: computed(() =>
        state.channelMembers.filter((x) => x.status !== 'OFFLINE')
      ),
      offline: computed(() =>
        state.channelMembers.filter((x) => x.status === 'OFFLINE')
      ),
    };
  },
});
</script>
