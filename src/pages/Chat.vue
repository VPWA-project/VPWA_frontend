<template>
  <q-page class="row items-center justify-evenly">
    <ChatMessagesComponent :key="activeChannel ? `chat-messages-${activeChannel.id}`: `chat-messages`" />
  </q-page>
</template>

<script lang="ts">
import { Channel } from 'src/contracts';
import { useStore } from 'src/store';
import { defineComponent, computed } from 'vue';
import ChatMessagesComponent from '../components/ChatMessagesComponent.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { ChatMessagesComponent },

  setup() {
    const $store = useStore();

    return {
      activeChannel: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
      ),
    };
  },
});
</script>
