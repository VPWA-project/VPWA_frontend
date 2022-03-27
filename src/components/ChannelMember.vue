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
import { User } from 'src/store/user/state';

import { defineComponent, PropType, toRef } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  props: {
    id: {
      type: Number,
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
    channelMembers: {
      type: Array as PropType<Array<User>>,
      required: true,
    },
    background: String,
  },
  components: {
    UserBanner,
  },
  setup(props) {
    const $q = useQuasar();

    const channelMembers = toRef(props, 'channelMembers');

    const confirmRevokeUser = (id: number) => {
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
        kickUser(id);
        $q.notify({
          message: `User ${
            member.firstname + ' ' + member.lastname
          } was revoked successfully`,
          color: 'grey-8',
          type: 'positive',
        });
      });
    };

    const kickUser = (id: number) => {
      const index = channelMembers.value.map((member) => member.id).indexOf(id);

      if (index > -1) {
        channelMembers.value.splice(index, 1);
      }
    };

    const confirmKickUser = (id: number) => {
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

    const banUser = (id: number) => {
      const index = channelMembers.value.map((member) => member.id).indexOf(id);

      if (index > -1) {
        channelMembers.value.splice(index, 1);
      }
    };

    return {
      confirmKickUser,
      confirmRevokeUser,
    };
  },
});
</script>
