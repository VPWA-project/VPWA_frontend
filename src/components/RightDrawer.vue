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
      :firstname="member.firstname"
      :lastname="member.lastname"
      :nickname="member.nickname"
      :status="member.status"
    />

    <q-item>
      <q-item-section>
        <q-item-label class="text-grey-7">Offline</q-item-label>
      </q-item-section>
    </q-item>

    <ChannelMember
      v-for="member in offline"
      :key="member.id"
      :firstname="member.firstname"
      :lastname="member.lastname"
      :nickname="member.nickname"
      :status="member.status"
    />
  </q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChannelMember from './ChannelMember.vue';

export default defineComponent({
  components: {
    ChannelMember
},
  setup() {
    const channelMembers = [
      {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        nickname: 'john',
        status: 'ONLINE'
      },
      {
        id: 2,
        firstname: 'Frank',
        lastname: 'Doe',
        nickname: 'frank',
        status: 'DND'
      },
      {
        id: 3,
        firstname: 'Martin',
        lastname: 'Doe',
        nickname: 'martin',
        status: 'OFFLINE'
      }
    ]

    return {
      online: channelMembers.filter(x => x.status !== 'OFFLINE'),
      offline: channelMembers.filter(x => x.status === 'OFFLINE')
    };
  },
});
</script>
