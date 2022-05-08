import {
  ChannelType,
  CreateChannelRequest,
  Channel,
  User,
  KickType,
} from 'src/contracts';
import { StateInterface } from 'src/store';
import { notifyUserPositive, notifyUserNegative } from 'src/utils/utils';
import { Router } from 'vue-router';
import { Store } from 'vuex';

class CommandService {
  processJoinCommand = async (
    $store: Store<StateInterface>,
    args: string[]
  ) => {
    const [channelName, channelType = 'PUBLIC', rest] = args;

    if (
      !rest &&
      (channelType.toUpperCase() === ChannelType.Public ||
        channelType.toUpperCase() === ChannelType.Private)
    ) {
      await $store
        .dispatch('createChannel/create', {
          name: channelName,
          type: channelType.toUpperCase(),
          invitations: undefined,
        } as CreateChannelRequest)
        .then(() =>
          notifyUserPositive(
            `The channel ${channelName} was created successfully`
          )
        )
        .catch(async () => {
          const channel = (await $store.dispatch(
            'channels_v2/getChannel',
            channelName
          )) as Channel | null;

          if (channel)
            await $store
              .dispatch('channels_v2/joinChannel', channel.id)
              .then(() =>
                notifyUserPositive(
                  `Successfully joined to the channel ${channelName}`
                )
              )
              .catch(() => notifyUserNegative('Unexpected error'));
        });
    } else
      notifyUserNegative(
        'The syntax of the command is incorrect. Use: /join channelName [private]'
      );
  };

  processCancelCommand = async (
    $store: Store<StateInterface>,
    router: Router,
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

  processQuitCommand = async (
    $store: Store<StateInterface>,
    router: Router,
    args: string[],
    activeChannel: Channel | null,
    amIChannelAdmin: boolean
  ) => {
    if (args.length) {
      notifyUserNegative('The syntax of the command is incorrect. Use: /quit');
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

  processKickRevokeCommand = async (
    $store: Store<StateInterface>,
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

  processInviteCommand = async (
    $store: Store<StateInterface>,
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

  processListCommand = async (
    $store: Store<StateInterface>,
    args: string[],
    activeChannel: Channel | null,
    amIChannelMember: boolean
  ) => {
    if (args.length !== 0) {
      notifyUserNegative('The syntax of the command is incorrect. Use: /list');
      return;
    }
    if (!activeChannel) {
      notifyUserNegative('No channel was selected');
      return;
    }
    if (!amIChannelMember) {
      notifyUserNegative('You are not member of this channel');
      return;
    }

    await $store.dispatch('gui/setRightDrawer', true);
  };
}

export default new CommandService();
