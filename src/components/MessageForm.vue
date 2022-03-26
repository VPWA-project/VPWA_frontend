<template>
  <div
    class="bg-cyan-9 text-black q-px-sm q-mx-sm rounded-borders border-all-15"
  >
    <div class="col">
      <TypingChips />
      <q-form
        class="row full-width no-wrap q-pb-sm"
        @submit.prevent.stop="handleSubmit"
      >
        <q-input
          rounded
          outlined
          dense
          class="WAL__field col-grow q-mr-sm"
          bg-color="white"
          v-model="state.message"
          placeholder="Type a message"
        />
        <q-btn round color="cyan-8" icon="send" type="submit" />
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import TypingChips from './TypingChips.vue';
import { useStore } from 'src/store';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MessageForm',
  setup() {
    const state = reactive({
      message: '',
    });
    const $store = useStore();
    const route = useRoute();

    var selectedChannel = {
      id: 1,
      messages: [{ tag: false, message: 'Hi' }],
    };

    const handleSubmit = () => {
      const trimmedMessage = state.message.trim();
      if (!!trimmedMessage) {
        $store
          .dispatch('channels/appendChannelMessage', {
            channelId: route.params.id as unknown as number,
            message: trimmedMessage,
          })
          .catch(console.log);
      }
      console.log($store.state.channels.channels);
      state.message = '';
    };
    return {
      state,
      handleSubmit,
    };
  },
  components: { TypingChips },
});
</script>

<style scoped>
.border-all-15 {
  border-radius: 15px 15px 0px 0px;
}
</style>
