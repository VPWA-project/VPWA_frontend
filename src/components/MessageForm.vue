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
        <q-btn round color="cyan-8" icon="send" type="submit" />
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import TypingChips from './TypingChips.vue';
import { useStore } from 'src/store';
import { useRoute, useRouter } from 'vue-router';
import { Channel } from 'src/contracts';
import { commandService } from 'src/services';

export default defineComponent({
  name: 'MessageForm',
  setup() {
    const state = reactive({
      message: '',
      sendedLastEdit: false,
    });
    const $store = useStore();
    const route = useRoute();
    const router = useRouter();

    const activeChannel = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
    );

    const amIChannelAdmin = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/amIChannelAdmin'] as boolean
    );

    const amIChannelMember = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/amIChannelMember'] as boolean
    );

    const sendTypedMessage = async () => {
      if (
        (!state.message || state.message.startsWith('/')) &&
        !state.sendedLastEdit
      )
        return;

      await $store.dispatch('channels_v2/sendTypedMessage', {
        channelName: activeChannel.value?.name,
        message: state.message.startsWith('/') ? '' : state.message,
      });

      state.sendedLastEdit = true;
      if (!state.message) state.sendedLastEdit = false;
    };

    const handleSubmit = async () => {
      if (!state.message) return;

      const message = state.message;

      if (message.startsWith('/')) {
        // command
        const words = message.split(' ');
        const command = words[0];
        const args = words.slice(1);

        if (command === '/join')
          await commandService.processJoinCommand($store, args);
        else if (command === '/cancel')
          await commandService.processCancelCommand(
            $store,
            router,
            args,
            activeChannel.value
          );
        else if (command === '/quit')
          await commandService.processQuitCommand(
            $store,
            router,
            args,
            activeChannel.value,
            amIChannelAdmin.value
          );
        else if (command === '/kick' || command === '/revoke')
          await commandService.processKickRevokeCommand(
            $store,
            command,
            args,
            activeChannel.value
          );
        else if (command === '/invite')
          await commandService.processInviteCommand(
            $store,
            args,
            activeChannel.value,
            amIChannelAdmin.value
          );
        else if (command === '/list')
          await commandService.processListCommand(
            $store,
            args,
            activeChannel.value,
            amIChannelMember.value
          );
        else commandService.notifyUserNegative('Unknown command');
      } else {
        const tags = message
          .split(' ')
          .filter((word) => word.startsWith('@'))
          .map((nickname) => nickname.slice(1));

        await $store
          .dispatch('channels_v2/addMessage', {
            channel: route.params.name as string,
            message,
            tags,
          })
          .catch(console.log);
      }

      state.message = '';

      await sendTypedMessage();
    };

    return {
      state,
      handleSubmit,
      activeChannel: computed(() => $store.state.channels_v2.active),
      amIChannelMember: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['channels_v2/amIChannelMember'] as boolean
      ),
      sendTypedMessage,
    };
  },
  components: { TypingChips },
});
</script>
