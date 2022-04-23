<template>
  <UserBanner
    :class="background"
    :firstname="firstname"
    :lastname="lastname"
    :nickname="nickname"
    :status="status"
  >
    <template v-slot:append v-if="show">
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

import { computed, defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { KickType, User } from 'src/contracts';
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
    show: Boolean,
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
      if (!activeChannelName.value) return;

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
        kickUser(id, KickType.Revoke).catch(console.log);
        $q.notify({
          message: `User ${
            member.firstname + ' ' + member.lastname
          } was revoked successfully`,
          color: 'grey-8',
          type: 'positive',
        });
      });
    };

    const kickUser = async (id: string, method: KickType) => {
      await $store.dispatch('channels_v2/kickUser', {
        channelName: activeChannelName.value,
        userId: id,
        method,
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
        kickUser(id, KickType.Kick)
          .then(() => {
            $q.notify({
              message: `User ${
                member.firstname + ' ' + member.lastname
              } was kicked successfully`,
              color: 'grey-8',
              type: 'positive',
            });
          })
          .catch(console.log);
      });
    };

    return {
      confirmKickUser,
      confirmRevokeUser,
    };
  },
});
</script>
