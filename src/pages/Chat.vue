<template>
  <q-page class="row items-center justify-evenly">
    <ChatMessagesComponent :messages="messages" />
  </q-page>
</template>

<script lang="ts">
import { SerializedMessage } from 'src/contracts';
import { useStore } from 'src/store';
import { defineComponent, computed } from 'vue';
import ChatMessagesComponent from '../components/ChatMessagesComponent.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { ChatMessagesComponent },

  setup() {
    const $store = useStore()

    const messages = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return $store.getters['channels_v2/currentMessages'] as SerializedMessage[]
    })

    return {
      messages
    }
  },
});
</script>
