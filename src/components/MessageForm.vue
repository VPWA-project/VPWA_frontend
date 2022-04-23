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
          @keyup="sendTypedMessage"
          v-model.trim="state.message"
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
import { Channel } from 'src/contracts';

export default defineComponent({
  name: 'MessageForm',
  setup() {
    const state = reactive({
      message: '',
      sendedLastEdit: false
    });
    const $store = useStore();
    const route = useRoute();
    const $q = useQuasar();

    const activeChannel = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
    );

    const handleSubmit = async () => {
      if (!state.message) return;

      await $store
        .dispatch('channels_v2/addMessage', {
          channel: route.params.name as string,
          message: state.message,
        })
        .catch(console.log);

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
      activeChannel: computed(() => $store.state.channels_v2.active),
      amIChannelMember: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['channels_v2/amIChannelMember'] as boolean
      ),
      sendTypedMessage: async () => {
        if(!state.message && !state.sendedLastEdit) return

        await $store.dispatch('channels_v2/sendTypedMessage', {
          channelName: activeChannel.value?.name,
          message: state.message,
        })

        state.sendedLastEdit = true
        if(!state.message) state.sendedLastEdit = false
      }
    };
  },
  components: { TypingChips },
});
</script>
