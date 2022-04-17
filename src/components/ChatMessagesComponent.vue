<template>
  <div v-if="amIChannelMember" class="q-pa-md full-width bg-white">
    <q-infinite-scroll ref="area" @load="onLoad" reverse>
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
            :name="fullName(message.user.firstname, message.user.lastname)"
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
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import moment from 'moment';
// import { useStore } from 'src/store';
import { PageMetaData, SerializedMessage } from 'src/contracts';
import { QInfiniteScroll, scroll } from 'quasar';
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

    const page = computed(
      () =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        $store.getters[
          'channels_v2/getCurrentPageMetaData'
        ] as PageMetaData | null
    );

    // const { getVerticalScrollPosition, setVerticalScrollPosition } = scroll

    const area = ref<QInfiniteScroll>();

    const scrollMessages = () => {
      // setVerticalScrollPosition(area.value?.scrollTarget as Element, 1.1)
    };

    watch(messages, () => {
      void nextTick(() => scrollMessages());
    });

    return {
      onLoad: (_: number, done: (stop: boolean | undefined) => void) => {
        setTimeout(() => {
          console.log(page.value)
          if(page.value?.current_page === page.value?.last_page) done(true)
          else done(false)
        }, 2000);
      },
      area,
      messages,
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
      amIChannelMember: computed(() => true),
    };
  },
});
</script>

<style>
.full-width {
  width: 100%;
}
</style>
