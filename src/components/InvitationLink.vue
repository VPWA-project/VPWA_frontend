<template>
  <ChannelLink :id="channelId" :name="name" :type="type">
    <template v-slot:append>
      <div class="flex justify-end q-gutter-sm">
        <q-btn
          round
          size="sm"
          color="blue-grey-9"
          icon="highlight_off"
          @click="confirmInvitationRefuse(id, InvitationState.Refuse, name)"
        />
        <q-btn
          round
          size="sm"
          color="cyan-7"
          icon="check_circle_outline"
          @click="
            processInvitation({
              id,
              state: InvitationState.Accept,
            })
          "
        />
      </div>
    </template>
    <template v-slot:invitedBy>
      <div style="font-size: 10px">by Adam Bublavy</div>
    </template>
  </ChannelLink>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { useStore } from 'src/store';
import {
  ChannelType,
  InvitationInfo,
  InvitationState,
} from 'src/store/channels/state';
import { defineComponent, PropType } from 'vue';
import ChannelLink from './ChannelLink.vue';

export default defineComponent({
  props: {
    id: {
      type: Number,
      required: true,
    },
    channelId: {
      type: Number,
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
  },
  components: {
    ChannelLink,
  },
  setup() {
    const $store = useStore();
    const $q = useQuasar();

    const processInvitation = (inv: InvitationInfo) => {
      $store.dispatch('channels/processInvitation', inv).catch(console.log);
    };

    const confirmInvitationRefuse = (
      linkId: number,
      state: InvitationState,
      channelName: string
    ) => {
      $q.dialog({
        title: 'Confirm',
        message: `Would you like to really refuse invitation to ${channelName}`,
        cancel: true,
        persistent: false,
      }).onOk(() => {
        processInvitation({ id: linkId, state });
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
