<template>
  <div v-if="amIChannelMember" class="q-pa-md full-width bg-white">
    <q-infinite-scroll @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="cyan-9" name="dots" size="40px" />
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
            :bg-color="message.tag ? 'cyan-5' : 'blue-grey-2'"
            :stamp="timeStamp(message.createdAt)"
          >
            <template v-slot:avatar>
              <q-avatar
                class="q-mr-md"
                rounded
                color="cyan-7"
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
import { computed, defineComponent, PropType } from 'vue';
import moment from 'moment';
import { useStore } from 'src/store';
import { SerializedMessage } from 'src/contracts';

export default defineComponent({
  props: {
    messages: {
      type: Array as PropType<SerializedMessage[]>,
      default: () => []
    }
  },
  setup() {
    const $store = useStore();

    return {
      onLoad: (_: number, done: (stop: boolean | undefined) => void) => {
        setTimeout(() => {
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

      areDatesSame: computed(() => (current: Date, previous: Date) => {
        return (
          current.getDate() === previous.getDate() &&
          current.getMonth() === previous.getMonth() &&
          current.getFullYear() === previous.getFullYear()
        );
      }),
      amIChannelMember: computed(() => $store.state.channels.amIChannelMember),
    };
  },
});
</script>

<style>
.full-width {
  width: 100%;
}
</style>
