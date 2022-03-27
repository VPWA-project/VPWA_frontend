<template>
  <div class="bg-cyan-9 text-black q-px-sm q-mx-sm border-15">
    <div class="col">
      <TypingChips v-if="amIChannelMember && activeChannel" />

      <q-form
        class="row full-width no-wrap q-py-sm"
        @submit.prevent.stop="handleSubmit"
      >
        <q-input
          rounded
          outlined
          dense
          class="col-grow q-mr-sm"
          bg-color="white"
          v-model="state.message"
          placeholder="Type a message"
        />
        <q-btn
          round
          color="cyan-8"
          icon="send"
          type="submit"
          @click="showNotif"
        />
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import TypingChips from './TypingChips.vue';
import { useStore } from 'src/store';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'MessageForm',
  setup() {
    const state = reactive({
      message: '',
    });
    const $store = useStore();
    const route = useRoute();
    const $q = useQuasar();

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
      showNotif() {
        $q.notify({
          message: 'John Doe',
          caption: 'Heeey Jozko, How are you ?',
          color: 'grey-2',
          textColor: 'black',
          position: 'bottom-right',
        });
      },
      activeChannel: computed(() => $store.state.channels.activeChannel),
      amIChannelMember: computed(() => $store.state.channels.amIChannelMember),
    };
  },
  components: { TypingChips },
});
</script>
