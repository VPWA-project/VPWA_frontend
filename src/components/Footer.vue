<template>
  <MessageForm v-if="amIChannelMember" />
  <InvitationResolveForm v-else :name="activeChannel?.name" />
</template>

<script lang="ts">
import MessageForm from './MessageForm.vue';
import InvitationResolveForm from './InvitationResolveForm.vue';
import { computed, defineComponent } from 'vue';
import { useStore } from 'src/store';

export default defineComponent({
  components: {
    MessageForm,
    InvitationResolveForm,
  },
  setup() {
    const $store = useStore();

    return {
      activeChannel: computed(() => $store.state.channels.activeChannel),
      amIChannelMember: computed(() => $store.state.channels.amIChannelMember)
    };
  },
});
</script>
