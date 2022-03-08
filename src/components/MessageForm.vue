<template>
  <q-toolbar class="bg-grey-3 text-black">
    <div class="col">
      <div class="q-py-sm">
        <q-card v-show="state.showMessage" class="q-my-sm">
          <q-card-section class="bg-primary text-white">
            <div class="text-subtitle2">sangalaa is typing</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
              Hi all
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat @click="closeShowMessage">Close</q-btn>
          </q-card-actions>
        </q-card>
        <q-chip clickable @click="openShowMessage" icon="textsms"
          >sangalaa is typing...</q-chip
        >
        <q-chip clickable @click="openShowMessage" icon="textsms"
          >adam is typing...</q-chip
        >
      </div>
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

export default defineComponent({
  name: 'MessageForm',

  setup() {
    const state = reactive({
        message: '',
        showMessage: false
    })

    const openShowMessage = () => state.showMessage = true
    const closeShowMessage = () => state.showMessage = false

    const handleSubmit = () => {
      const trimmedMessage = state.message.trim();

      if (!!trimmedMessage) {
        // TODO: dispatch send event
      }
      state.message = '';
    };

    return {
      state,
      openShowMessage,
      closeShowMessage,
      handleSubmit,
    };
  },
});
</script>
