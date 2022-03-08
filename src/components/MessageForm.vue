<template>
  <q-toolbar class="bg-grey-3 text-black">
    <div class="col">
      <TypingChips />
      <q-form
        class="row full-width no-wrap"
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
        <q-btn round flat icon="send" type="submit" />
      </q-form>
    </div>
  </q-toolbar>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import TypingChips from './TypingChips.vue';

export default defineComponent({
  name: 'MessageForm',
  setup() {
    const state = reactive({
      message: '',
    });

    const handleSubmit = () => {
      const trimmedMessage = state.message.trim();
      if (!!trimmedMessage) {
        // TODO: dispatch send event
      }
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
