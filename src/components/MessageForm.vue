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
import {
  Channel,
  ChannelType,
  CreateChannelRequest,
  KickType,
  User,
} from 'src/contracts';
import { Notify } from 'quasar';

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

    const sendTypedMessage = async () => {
      if (!state.message && !state.sendedLastEdit) return;

      await $store.dispatch('channels_v2/sendTypedMessage', {
        channelName: activeChannel.value?.name,
        message: state.message,
      });

      state.sendedLastEdit = true;
      if (!state.message) state.sendedLastEdit = false;
    };

    const notifyUser = (message: string, type: string, color: string) => {
      Notify.create({
        message,
        color: color,
        textColor: 'black',
        type: type,
        position: 'bottom',
      });
    };

    const notifyUserPositive = (message: string) =>
      notifyUser(message, 'positive', 'grey-2');
    const notifyUserNegative = (message: string) =>
      notifyUser(message, 'negative', 'red-2');

    const processJoinCommand = async (args: string[]) => {
      const [channelName, channelType = 'PUBLIC', rest] = args;

      if (
        !rest &&
        (channelType.toUpperCase() === ChannelType.Public ||
          channelType.toUpperCase() === ChannelType.Private)
      ) {
        await $store
          .dispatch('createChannel/create', {
            name: channelName,
            type: channelType,
            invitations: undefined,
          } as CreateChannelRequest)
          .then(() => notifyUserPositive('Success'))
          .catch(() => notifyUserNegative('Unexpected error'));
      } else
        notifyUserNegative(
          'The syntax of the command is incorrect. Use: /join channelName [private]'
        );
    };

    const processCancelCommand = async (
      args: string[],
      activeChannel: Channel | null
    ) => {
      if (args.length) {
        notifyUserNegative(
          'The syntax of the command is incorrect. Use: /cancel'
        );
        return;
      }
      if (!activeChannel) {
        notifyUserNegative('No channel was selected');
        return;
      }

      const channelname = activeChannel.name;

      await $store
        .dispatch('channels_v2/leaveChannel', activeChannel.name)
        .then(async () => {
          notifyUserPositive(`Channel ${channelname} left successfully`);
          await router.push({ name: 'home' });
        })
        .catch(() => notifyUserNegative('Unexpected error'));
    };

    const processQuitCommand = async (
      args: string[],
      activeChannel: Channel | null,
      amIChannelAdmin: boolean
    ) => {
      if (args.length) {
        notifyUserNegative(
          'The syntax of the command is incorrect. Use: /quit'
        );
        return;
      }
      if (!activeChannel) {
        notifyUserNegative('No channel was selected');
        return;
      }
      if (!amIChannelAdmin) {
        notifyUserNegative('You are not admin of the channel');
        return;
      }

      const channelName = activeChannel.name;

      await $store
        .dispatch('channels_v2/leaveChannel', activeChannel.name)
        .then(async () => {
          notifyUserPositive(`Channel ${channelName} left successfully`);
          await router.push({ name: 'home' });
        })
        .catch(() => notifyUserNegative('Unexpected error'));
    };

    const processKickRevokeCommand = async (
      command: string,
      args: string[],
      activeChannel: Channel | null
    ) => {
      if (args.length !== 1) {
        notifyUserNegative(
          `The syntax of the command is incorrect. Use: ${command} nickname`
        );
        return;
      }
      if (!activeChannel) {
        notifyUserNegative('No channel was selected');
        return;
      }
      const nickname = args[0];

      const userToBeKicked = (await $store.dispatch(
        'channels_v2/getUserByNicknameFromActiveChannelStore',
        nickname
      )) as User | undefined;

      if (userToBeKicked)
        await $store
          .dispatch('channels_v2/kickUser', {
            channelName: activeChannel.name,
            userId: userToBeKicked.id,
            method: command === '/kick' ? KickType.Kick : KickType.Revoke,
          })
          .then(() =>
            notifyUserPositive(
              `User ${nickname} was ${
                command === '/kick' ? 'kicked' : 'revoked'
              } successfully`
            )
          )
          .catch(() => notifyUserNegative('Unexpected error'));
      else notifyUserNegative(`User ${nickname} was not found`);
    };

    const processInviteCommand = async (
      args: string[],
      activeChannel: Channel | null,
      amIChannelAdmin: boolean
    ) => {
      if (args.length !== 1) {
        notifyUserNegative(
          'The syntax of the command is incorrect. Use: /invite nickname'
        );
        return;
      }
      if (!activeChannel) {
        notifyUserNegative('No channel was selected');
        return;
      }
      if (activeChannel.type === ChannelType.Private && !amIChannelAdmin) {
        notifyUserNegative('You are not admin of the channel');
        return;
      }

      const nickname = args[0];

      await $store
        .dispatch('invitations/inviteByNickname', {
          channelId: activeChannel.id,
          nicknames: args,
        })
        .then(() =>
          notifyUserPositive(`User ${nickname} was invited successfully`)
        )
        .catch(() => notifyUserNegative('Unexpected error'));
    };

    const handleSubmit = async () => {
      if (!state.message) return;

      if (state.message.startsWith('/')) {
        // command
        const words = state.message.split(' ');
        const command = words[0];
        const args = words.slice(1);

        if (command === '/join') await processJoinCommand(args);
        else if (command === '/cancel')
          await processCancelCommand(args, activeChannel.value);
        else if (command === '/quit')
          await processQuitCommand(
            args,
            activeChannel.value,
            amIChannelAdmin.value
          );
        else if (command === '/kick' || command === '/revoke')
          await processKickRevokeCommand(command, args, activeChannel.value);
        else if (command === '/invite')
          await processInviteCommand(
            args,
            activeChannel.value,
            amIChannelAdmin.value
          );
      } else {
        // TODO: parse tags
        const tags = state.message
          .split(' ')
          .filter((word) => word.startsWith('@'))
          .map((nickname) => nickname.slice(1));

        await $store
          .dispatch('channels_v2/addMessage', {
            channel: route.params.name as string,
            message: state.message,
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
