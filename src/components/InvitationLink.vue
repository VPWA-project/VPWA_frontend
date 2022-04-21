<template>
  <ChannelLink :id="channel.id" :name="channel.name" :type="channel.type">
    <template v-slot:append>
      <div class="flex justify-end q-gutter-sm">
        <q-btn
          round
          size="sm"
          color="blue-grey-9"
          icon="highlight_off"
          @click="confirmInvitationRefuse(id, 'DECLINE', channel)"
        />
        <q-btn
          round
          size="sm"
          color="cyan-7"
          icon="check_circle_outline"
          @click="processInvitation(id, 'ACCEPT', channel)"
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
import { Channel, InvitationStatus } from 'src/contracts';
import { useStore } from 'src/store';
import { defineComponent, PropType } from 'vue';
import ChannelLink from './ChannelLink.vue';

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    channel: {
      type: Object as PropType<Channel>,
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

    const processInvitation = (id: string, status: InvitationStatus, channel: Channel) => {
      $store
        .dispatch('invitations/resolveInvitation', { id, status, channel })
        .catch(console.log);
    };

    const confirmInvitationRefuse = (
      linkId: string,
      status: InvitationStatus,
      channel: Channel
    ) => {
      $q.dialog({
        title: 'Confirm',
        message: `Would you like to really refuse invitation to ${channel.name}`,
        cancel: true,
        persistent: false,
      }).onOk(() => {
        processInvitation(linkId, status, channel);
      });
    };

    return {
      processInvitation,
      confirmInvitationRefuse,
    };
  },
});
</script>
