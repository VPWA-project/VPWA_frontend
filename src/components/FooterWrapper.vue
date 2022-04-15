<template>
  <InvitationResolveForm v-if="!amIChannelMember && activeChannel" :name="activeChannel?.name" />
  <MessageForm v-else />
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
