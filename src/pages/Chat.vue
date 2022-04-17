<template>
  <q-page class="row items-center justify-evenly">
    <ChatMessagesComponent />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChatMessagesComponent from '../components/ChatMessagesComponent.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { ChatMessagesComponent },

  setup() {
    return {};
  },
});
</script>
