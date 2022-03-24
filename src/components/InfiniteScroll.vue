<template>
  <div class="q-pa-md full-width bg-white">
    <q-infinite-scroll @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div v-for="(message, index) in messages" :key="index">
        <div class="row items-center">
          <q-avatar
            size="35px"
            class="q-mr-md"
            rounded
            color="primary"
            text-color="white"
          >
            JM</q-avatar
          >
          <q-chat-message
            push
            :class="{ 'q-mb-none': message.tag }"
            name="me"
            :text="[message.message]"
            :bg-color="message.tag ? 'red' : 'bg-blue'"
            :stamp="timeStamp(message.createdAt)"
          />
        </div>
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import moment from 'moment';

export default defineComponent({
  // props: {
  //   messages: Array
  // },

  setup() {
    const items = ref(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    const messages = ref([
      {
        tag: true,
        message: 'Hello',
        createdAt: moment(moment.now()).subtract(2, 'days').toDate(),
      },
      {
        tag: false,
        message: 'Good morning',
        createdAt: moment(moment.now()).subtract(1, 'days').toDate(),
      },
      {
        tag: false,
        message: 'Bye',
        createdAt: moment(moment.now()).subtract(1, 'hours').toDate(),
      },
      {
        tag: true,
        message: 'How are you ?',
        createdAt: moment(moment.now()).subtract(1, 'minutes').toDate(),
      },
    ]);

    return {
      items,
      messages,
      onLoad: (_: number, done: (stop: boolean | undefined) => void) => {
        setTimeout(() => {
          messages.value.splice(
            0,
            0,
            {
              tag: false,
              message: 'a',
              createdAt: moment(moment.now()).subtract(3, 'days').toDate(),
            },
            {
              tag: false,
              message: 'b',
              createdAt: moment(moment.now()).subtract(3, 'days').toDate(),
            },
            {
              tag: false,
              message: 'c',
              createdAt: moment(moment.now()).subtract(3, 'days').toDate(),
            },
            {
              tag: false,
              message: 'd',
              createdAt: moment(moment.now()).subtract(3, 'days').toDate(),
            },
            {
              tag: false,
              message: 'e',
              createdAt: moment(moment.now()).subtract(3, 'days').toDate(),
            }
          );
          done(false);
        }, 2000);
      },

      timeStamp: computed(() => {
        return (time: Date) => {
          const today = moment.now();
          const diff = moment(time).diff(today);

          return moment.duration(diff).humanize(true);
        };
      }),
    };
  },
});
</script>

<style>
.full-width {
  width: 100%;
}
</style>
