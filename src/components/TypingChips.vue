<template>
  <div :class="{ 'q-py-sm': typedMessages.length > 0 }">
    <q-card v-show="state.showMessage" class="q-my-sm border-15">
      <q-card-section class="bg-grey-2 text-black">
        <div class="text-subtitle2">{{ state.message?.author.nickname }} is typing</div>
      </q-card-section>

      <q-card-section> {{ state.message?.content }} </q-card-section>

      <q-card-actions align="right">
        <q-btn
          class="self-end bg-grey-2 q-px-sm border-15"
          color="black"
          clickable
          flat
          @click="closeShowMessage"
          icon="close"
        />
      </q-card-actions>
    </q-card>

    <q-chip
      clickable
      outline
      color="white"
      @click="openMessage(message)"
      v-for="(message, index) in typedMessages.slice(0, maxChipsToDisplay)"
      :key="index"
    >
      {{ message.author.nickname }}
      <q-spinner-dots class="q-pl-xs q-mt-xs" size="24px" />
    </q-chip>

    <q-chip
      :ripple="false"
      outline
      color="white"
      v-if="typedMessages.length > maxChipsToDisplay"
    >
      and {{ typedMessages.length - maxChipsToDisplay }} more
      <q-spinner-dots class="q-pl-xs q-mt-xs" size="24px" />
    </q-chip>
  </div>
</template>

<script lang="ts">
import { TypedMessage } from 'src/contracts';
import { useStore } from 'src/store';
import { computed, defineComponent, reactive, watch } from 'vue';

export default defineComponent({
  setup() {
    const $store = useStore();

    const state = reactive({
      showMessage: false,
      message: null as TypedMessage | null,
      lastOpenedUserId: '',
    });

    const typedMessages = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/currentTypedMessages'] as TypedMessage[]
    );

    watch(() => typedMessages.value, (newValue) => {
      if(!state.message) return

      const newMessage = newValue.find(m => m.author.id === state.message?.author.id)

      if(newMessage) state.message = newMessage
      else {
        state.message = null
        state.showMessage = false
        state.lastOpenedUserId = ''
      }
    })

    const openShowMessage = () => (state.showMessage = true);
    const closeShowMessage = () => {
      state.showMessage = false;
      state.lastOpenedUserId = '';
    };

    const openMessage = (message: TypedMessage) => {
      if (state.lastOpenedUserId === message.author.id) {
        closeShowMessage();
        return;
      }

      state.message = message
      state.lastOpenedUserId = message.author.id;

      openShowMessage();
    };

    return {
      state,
      typedMessages,
      maxChipsToDisplay: 2,
      closeShowMessage,
      openMessage,
    };
  },
});
</script>
