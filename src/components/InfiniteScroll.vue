<template>
  <div class="q-pa-md full-width bg-white">
    <q-infinite-scroll @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div v-for="(message, index) in messages" :key="index">
        <q-chat-message
          v-if="
            index == 0 ||
            !areDatesSame(message.createdAt, messages[index - 1].createdAt)
          "
          :label="date(message.createdAt)"
        />
        <div class="row items-center">
          <q-chat-message
            push
            :class="{ 'q-mb-none': message.tag }"
            :name="fullName(message.firstname, message.lastname)"
            :text="[message.message]"
            :bg-color="message.tag ? 'red' : 'bg-blue'"
            :stamp="timeStamp(message.createdAt)"
          >
            <template v-slot:avatar>
              <q-avatar
                class="q-mr-md"
                rounded
                color="primary"
                text-color="white"
              >
                {{ nameInitials(message.firstname, message.lastname) }}
              </q-avatar>
            </template>
          </q-chat-message>
        </div>
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import moment from 'moment';

export default defineComponent({
  setup() {
    const messages = ref([
      {
        firstname: 'John',
        lastname: 'Doe',
        nickname: 'john',
        tag: false,
        message: 'Hello',
        createdAt: moment(moment.now()).subtract(2, 'days').toDate(),
      },
      {
        firstname: 'Frank',
        lastname: 'Doe',
        nickname: 'frank',
        tag: true,
        message: 'Good morning',
        createdAt: moment(moment.now()).subtract(1, 'days').toDate(),
      },
      {
        firstname: 'Martin',
        lastname: 'Doe',
        nickname: 'martin',
        tag: false,
        message: 'Hi',
        createdAt: moment(moment.now()).subtract(1, 'hours').toDate(),
      },
      {
        firstname: 'Jozko',
        lastname: 'Mrkvicka',
        nickname: 'jozino',
        tag: false,
        message: 'Hi, how are you ?',
        createdAt: moment(moment.now()).subtract(1, 'minutes').toDate(),
      },
    ]);

    return {
      messages,
      onLoad: (_: number, done: (stop: boolean | undefined) => void) => {
        setTimeout(() => {
          messages.value.splice(
            0,
            0,
            {
              firstname: 'John',
              lastname: 'Doe',
              nickname: 'john',
              tag: false,
              message: 'a',
              createdAt: moment(moment.now()).subtract(3, 'days').toDate(),
            },
            {
              firstname: 'John',
              lastname: 'Doe',
              nickname: 'john',
              tag: false,
              message: 'b',
              createdAt: moment(moment.now()).subtract(3, 'days').toDate(),
            },
            {
              firstname: 'John',
              lastname: 'Doe',
              nickname: 'john',
              tag: false,
              message: 'c',
              createdAt: moment(moment.now()).subtract(3, 'days').toDate(),
            },
            {
              firstname: 'John',
              lastname: 'Doe',
              nickname: 'john',
              tag: false,
              message: 'd',
              createdAt: moment(moment.now()).subtract(3, 'days').toDate(),
            },
            {
              firstname: 'John',
              lastname: 'Doe',
              nickname: 'john',
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
          return moment(time).fromNow();
        };
      }),

      date: computed(() => {
        return (time: Date) => moment(time).format('DD/MM/YYYY');
      }),

      nameInitials: computed(
        () => (firstname: string, lastname: string) =>
          firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase()
      ),

      fullName: computed(
        () => (firstname: string, lastname: string) =>
          firstname + ' ' + lastname
      ),

      nickname: computed(() => (nickname: string) => '@' + nickname),

      areDatesSame: (current: Date, previous: Date) => {
        return (
          current.getDate() === previous.getDate() &&
          current.getMonth() === previous.getMonth() &&
          current.getFullYear() === previous.getFullYear()
        );
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
