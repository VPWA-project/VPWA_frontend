<template>
  <div class="q-pa-md full-width bg-white">
    <q-infinite-scroll @load="onLoad" reverse>
      <!--<q-infinite-scroll reverse>-->
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div v-for="(message, index) in selectedChannelMessages" :key="index">
        <div class="row items-end">
          <q-avatar
            size="35px"
            class="q-mr-md"
            rounded
            color="cyan-7"
            text-color="white"
          >
            JM</q-avatar
          >
          <q-chat-message
            v-if="message.tag"
            push
            name="me"
            :text="[message.message]"
            bg-color="cyan-8"
          />
          <q-chat-message
            v-if="!message.tag"
            push
            class="q-mb-none"
            name="me"
            :text="[message.message]"
            bg-color="blue-grey-2"
          />
        </div>
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/store';

export default defineComponent({
  // props: {
  //   messages: Array
  // },

  setup() {
    const items = ref(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    const $store = useStore();
    const route = useRoute();
    const channelId = ref(2);
    var selectedChannelMessages = ref([{ tag: false, message: 'Boom' }]);
    var selectedChannel = {
      id: 1,
      messages: [{ tag: false, message: 'Hi' }],
    };

    const channelsMessages = $store.state.channels.channels;

    watch(
      () => route.params.id,
      (id) => {
        channelId.value = id as unknown as number;
        selectedChannel = channelsMessages.find(
          ({ id }) => id == channelId.value
        )!;
        selectedChannelMessages.value = selectedChannel?.messages.map((a) => a);
      }
    );

    return {
      items,
      channelsMessages,
      selectedChannelMessages,

      onLoad: (_: number, done: (stop: boolean | undefined) => void) => {
        setTimeout(() => {
          selectedChannelMessages?.value.splice(
            0,
            0,
            { tag: false, message: 'a' },
            { tag: false, message: 'b' },
            { tag: false, message: 'c' },
            { tag: false, message: 'd' },
            { tag: false, message: 'e' }
          );
          done(false);
        }, 2000);
      },
    };
  },
});
</script>

<style>
.full-width {
  width: 100%;
}
</style>
