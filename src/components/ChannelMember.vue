<template>
  <UserBanner
    :class="background"
    :firstname="firstname"
    :lastname="lastname"
    :nickname="nickname"
    :status="status"
  >
    <template v-slot:append>
      <q-btn flat class="no-border q-pa-none" icon="more_vert">
        <q-menu fit>
          <q-list style="width: 150px">
            <q-item clickable @click="confirmRevokeUser(id)" v-close-popup>
              <q-item-section>
                <q-item-label>Revoke</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="confirmKickUser(id)" v-close-popup>
              <q-item-section>
                <q-item-label>Kick</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
  </UserBanner>
</template>

<script lang="ts">
import UserBanner from './UserBanner.vue';

import { computed, defineComponent, PropType, toRef } from 'vue';
import { useQuasar } from 'quasar';
import { User } from 'src/contracts';
import { useStore } from 'src/store';

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    background: String,
  },
  components: {
    UserBanner,
  },
  setup() {
    const $q = useQuasar();
    const $store = useStore();

    const channelMembers = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getOnlineUsers'] as User[]
    );

    const activeChannelName = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannelName'] as string | null
    );

    const confirmRevokeUser = (id: string) => {
      const member = channelMembers.value.find((member) => member.id === id);

      if (!member) {
        return;
      }

      $q.dialog({
        title: 'Confirm',
        message: `Would you really like to revoke ${
          member.firstname + ' ' + member.lastname
        }`,
        cancel: true,
        persistent: false,
      }).onOk(() => {
      kickUser(id).catch(console.log);
        $q.notify({
          message: `User ${
            member.firstname + ' ' + member.lastname
          } was revoked successfully`,
          color: 'grey-8',
          type: 'positive',
        });
      });
    };

    const kickUser = async (id: string) => {
      console.log('KICKING user')
      await $store.dispatch('channels_v2/kickUser', {
        channelName: activeChannelName.value,
        userId: id,
      });
    };

    const confirmKickUser = (id: string) => {
      const member = channelMembers.value.find((member) => member.id === id);

      if (!member) {
        return;
      }

      $q.dialog({
        title: 'Confirm',
        message: `Would you really like to kick ${
          member.firstname + ' ' + member.lastname
        }`,
        cancel: true,
        persistent: false,
      }).onOk(() => {
        banUser(id);
        $q.notify({
          message: `User ${
            member.firstname + ' ' + member.lastname
          } was kicked successfully`,
          color: 'grey-8',
          type: 'positive',
        });
      });
    };

    const banUser = (id: string) => {
      const index = channelMembers.value.map((member) => member.id).indexOf(id);

      kickUser(id).catch(console.log)
    };

    return {
      confirmKickUser,
      confirmRevokeUser,
    };
  },
});
</script>
