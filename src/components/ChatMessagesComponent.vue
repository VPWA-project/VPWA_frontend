<template>
  <div
    v-if="amIChannelMember && activeChannel"
    class="q-pa-md full-width bg-white"
  >
    <q-infinite-scroll :key="activeChannel.id" @load="onLoad" reverse>
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
            :class="{
              'q-mb-none': message.tags?.find(
                (user) => user.id === authUser.id
              ),
            }"
            :name="fullName(message.user.firstname, message.user.lastname)"
            :text="[message.message]"
            :bg-color="
              message.tags?.find((user) => user.id === authUser.id)
                ? 'cyan-5'
                : 'blue-grey-2'
            "
            :stamp="timeStamp(message.createdAt)"
          >
            <template v-slot:avatar>
              <q-avatar
                class="q-mr-md"
                rounded
                color="cyan-7"
                text-color="white"
              >
                {{
                  nameInitials(message.user.firstname, message.user.lastname)
                }}
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
import { SerializedMessage, User } from 'src/contracts';
import { useStore } from 'src/store';

export default defineComponent({
  setup() {
    const $store = useStore();

    const messages = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return $store.getters[
        'channels_v2/currentMessages'
      ] as SerializedMessage[];
    });

    const oldestMessageId = computed(
      () =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        $store.getters['channels_v2/getOldestMessageId'] as number | undefined
    );

    const authUser = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['auth/getAuthenticatedUser'] as User | null
    );

    const activeChannel = computed(() => $store.state.channels_v2.active);

    return {
      onLoad: async (_: number, done: (stop: boolean | undefined) => void) => {
        await $store
          .dispatch('channels_v2/fetchMessages', {
            channel: activeChannel.value,
            beforeId: oldestMessageId.value,
          })
          .then((messages: SerializedMessage[]) => {
            if (messages.length === 0) done(true);
            else done(false)
          })
          .catch(console.log);
      },
      messages,
      authUser,
      activeChannel,
      timeStamp: computed(() => {
        return (time: string) => {
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

      areDatesSame: computed(() => (current: string, previous: string) => {
        const currentDate = new Date(current);
        const previousDate = new Date(previous);

        return (
          currentDate.getDate() === previousDate.getDate() &&
          currentDate.getMonth() === previousDate.getMonth() &&
          currentDate.getFullYear() === previousDate.getFullYear()
        );
      }),
      amIChannelMember: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['channels_v2/amIChannelMember'] as boolean
      ),
      scrollTarget: ref(null),
    };
  },
});
</script>

<style>
.full-width {
  width: 100%;
}
</style>
