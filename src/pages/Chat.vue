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
      return $store.getters['channels/currentMessages'] as SerializedMessage[]
    })

    return {
      messages
    }
  },
});
</script>
