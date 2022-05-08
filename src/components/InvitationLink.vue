<template>
  <ChannelLink :id="channel.id" :name="channel.name" :type="channel.type">
    <template v-slot:append>
      <div class="flex justify-end q-gutter-sm">
        <q-btn
          round
          size="sm"
          color="blue-grey-9"
          icon="highlight_off"
          @click.prevent.stop="confirmInvitationRefuse(id, 'DECLINE', channel)"
        />
        <q-btn
          round
          size="sm"
          color="cyan-7"
          icon="check_circle_outline"
          @click.prevent.stop="processInvitation(id, 'ACCEPT', channel)"
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
import { AxiosError } from 'axios';
import { useQuasar } from 'quasar';
import { Channel, InvitationStatus } from 'src/contracts';
import { useStore } from 'src/store';
import { notifyUserNegative, notifyUserPositive } from 'src/utils/utils';
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

    const processInvitation = (
      id: string,
      status: InvitationStatus,
      channel: Channel
    ) =>
      $store
        .dispatch('invitations/resolveInvitation', { id, status, channel })
        .then(() =>
          notifyUserPositive(
            `Invitation to the channel ${channel.name} was successfully resolved`
          )
        )
        .catch((err: AxiosError) => notifyUserNegative(err.message));

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
        void processInvitation(linkId, status, channel)
      });
    };

    return {
      processInvitation,
      confirmInvitationRefuse,
    };
  },
});
</script>
