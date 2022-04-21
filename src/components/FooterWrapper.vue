<template>
  <!-- <InvitationResolveForm v-if="activeChannel" :name="activeChannel?.name" /> -->
  <MessageForm />
</template>

<script lang="ts">
import MessageForm from './MessageForm.vue';
// import InvitationResolveForm from './InvitationResolveForm.vue';
import { computed, defineComponent } from 'vue';
import { useStore } from 'src/store';

export default defineComponent({
  components: {
    MessageForm,
  },
  setup() {
    const $store = useStore();

    return {
      activeChannel: computed(() => $store.state.channels_v2.active),
      amIChannelMember: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['channels_v2/amIChannelMember'] as boolean
      ),
    };
  },
});
</script>
