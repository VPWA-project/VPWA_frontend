<template>
  <div class="bg-cyan-9 text-black q-pa-sm q-mx-sm border-15">
    <div class="text-center text-white" style="font-size: 24px">
      {{ name }}
    </div>
    <div class="column items-center q-py-sm">
      <q-btn
        flat
        label="Join channel"
        class="bg-white border-15"
        color="black"
        @click="joinChannel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Channel, ChannelType, Invitation } from 'src/contracts';
import { useStore } from 'src/store';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: Number,
    name: String,
  },
  setup() {
    const $store = useStore();

    const activeChannel = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
    );

    const invitations = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['invitations/getInvitations'] as Invitation[]
    );

    const joinChannel = async () => {
      if (!activeChannel.value) return;

      if (activeChannel.value.type === ChannelType.Public)
        await $store.dispatch(
          'channels_v2/joinChannel',
          activeChannel.value.id
        );
      else {
        const invitation = invitations.value.find(
          (invitation) => invitation.channelId === activeChannel.value?.id
        );

        if (invitation)
          await $store.dispatch('invitations/resolveInvitation', {
            id: invitation.id,
            status: 'ACCEPT',
            channel: activeChannel.value,
          });
      }
    };

    return {
      joinChannel,
    };
  },
});
</script>
