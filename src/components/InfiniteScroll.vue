<template>
  <div class="q-pa-md full-width">
    <q-infinite-scroll @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div v-for="(message, index) in selectedChannelMessages" :key="index">
        <div>
          <q-chat-message
            v-if="message.tag"
            push
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar1.jpg"
            :text="[message.message]"
            bg-color="red"
          />
          <q-chat-message
            v-if="!message.tag"
            push
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar1.jpg"
            :text="[message.message]"
            bg-color="green"
          />
        </div>
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  // props: {
  //   messages: Array
  // },

  setup() {
    const items = ref(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    const router = useRouter();
    const route = useRoute();
    const channelId = ref(1);

    watch(
      () => route.params.id,
      (id) => (channelId.value = id as unknown as number)
    );

    const channelsMessages = ref([
      {
        id: 1,
        messages: [
          { tag: true, message: 'Hello' },
          { tag: false, message: 'Good morning' },
          { tag: false, message: 'Bye' },
          { tag: true, message: 'How are you ?' },
        ],
      },
      {
        id: 2,
        messages: [
          { tag: false, message: 'Hi, my name is Jozko' },
          { tag: true, message: 'Hello, Jozko !' },
          { tag: false, message: 'How is it going ?' },
          { tag: false, message: 'Pretty well' },
        ],
      },
    ]);

    var selectedChannel = channelsMessages.value.find(
      ({ id }) => id == channelId.value
    );

    let selectedChannelMessages = selectedChannel?.messages.map((a) => a);

    return {
      items,
      channelsMessages,
      selectedChannelMessages,

      onLoad: (_: number, done: (stop: boolean | undefined) => void) => {
        //console.log(result);
        setTimeout(() => {
          selectedChannelMessages?.splice(
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
