<template>
  <ChannelLink :id="channelId" :name="name" :type="type">
    <template v-slot:append>
      <div class="flex justify-end q-gutter-sm">
        <q-btn
          round
          size="sm"
          color="blue-grey-9"
          icon="highlight_off"
          @click="confirmInvitationRefuse(id, 'DECLINE', name)"
        />
        <q-btn
          round
          size="sm"
          color="cyan-7"
          icon="check_circle_outline"
          @click="processInvitation(id, 'ACCEPT')"
        />
      </div>
    </template>
    <template v-slot:invitedBy>
      <div style="font-size: 10px">
        by {{ invitedByFirstname + ' ' + invitedByLastname }}
      </div>
    </template>
  </ChannelLink>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { InvitationStatus } from 'src/contracts';
import { useStore } from 'src/store';
import { ChannelType, InvitationState } from 'src/store/channels/state';
import { defineComponent, PropType } from 'vue';
import ChannelLink from './ChannelLink.vue';

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<ChannelType>,
      required: true,
    },
    invitedByFirstname: {
      type: String,
      required: true,
    },
    invitedByLastname: {
      type: String,
      required: true,
    },
  },
  components: {
    ChannelLink,
  },
  setup() {
    const $store = useStore();
    const $q = useQuasar();

    const processInvitation = (id: string, status: InvitationStatus) => {
      $store
        .dispatch('invitations/resolveInvitation', { id, status })
        .catch(console.log);
    };

    const confirmInvitationRefuse = (
      linkId: string,
      status: InvitationStatus,
      channelName: string
    ) => {
      $q.dialog({
        title: 'Confirm',
        message: `Would you like to really refuse invitation to ${channelName}`,
        cancel: true,
        persistent: false,
      }).onOk(() => {
        processInvitation(linkId, status);
      });
    };

    return {
      InvitationState,
      processInvitation,
      confirmInvitationRefuse,
    };
  },
});
</script>
