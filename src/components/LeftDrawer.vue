<template>
  <q-list>
    <div
      clickable
      @click="toggleUserBannerIcon"
      class="cursor-pointer no-padding"
    >
      <UserMenu />
      <UserBanner background="bg-grey-2" v-if="user" v-bind="user">
        <template v-slot:append>
          <q-item-section avatar>
            <q-icon :name="state.userBannerIcon" size="1.4em" />
          </q-item-section>
        </template>
      </UserBanner>
    </div>

    <div class="q-ma-md q-py-md bg-grey-2 border-15">
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium text-subtitle1"
            >Invitations</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-list>
        <InvitationLink
          v-for="link in invitations"
          :key="link.id"
          :id="link.id"
          :channel="link.channel"
          :invitedByFirstname="link.invitedBy.firstname"
          :invitedByLastname="link.invitedBy.lastname"
        />
      </q-list>
    </div>

    <div class="q-ma-md q-py-md bg-grey-2 border-15">
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium text-subtitle1"
            >Channels</q-item-label
          >
        </q-item-section>
        <q-item-section avatar>
          <div>
            <q-btn
              class="bg-white q-px-sm border-15"
              color="black"
              clickable
              flat
              @click="showBrowseChannels"
              icon-right="add_circle"
              label="Add"
            />
          </div>
        </q-item-section>
      </q-item>
      <SearchChannels
        :open="state.isBrowseChannelsOpen"
        @close="state.isBrowseChannelsOpen = false"
      />

      <q-list>
        <ChannelLink v-for="link in channels" :key="link.id" v-bind="link" />
      </q-list>
    </div>
  </q-list>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent, computed, reactive, watch, onMounted } from 'vue';
import UserMenu from './UserMenu.vue';
import UserBanner from './UserBanner.vue';
import ChannelLink from './ChannelLink.vue';
import SearchChannels from './SearchChannels.vue';
import { useRoute, useRouter } from 'vue-router';
import InvitationLink from './InvitationLink.vue';
import { Channel, ChannelType, Invitation } from 'src/contracts';

export default defineComponent({
  components: {
    UserMenu,
    UserBanner,
    ChannelLink,
    SearchChannels,
    InvitationLink,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const route = useRoute();

    const amIChannelMember = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/amIChannelMember'] as boolean
    );
    const activeChannel = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
    );

    const invitations = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['invitations/getInvitations'] as Invitation[]
    )

    const setActiveChannel = (name: string) => {
      console.log('Setting active channel: ', name);
      $store
        .dispatch('channels_v2/setActiveChannel', name)
        .then(async (channel: Channel) => {
          if(amIChannelMember.value) {
            await $store.dispatch('channels_v2/tryJoin', name)
          }
          else if(activeChannel.value?.type === ChannelType.Private) {
            const hasInvitation = !!invitations.value.find(invitation => invitation.channelId === channel.id)

            if(!hasInvitation) {
              await $router.push({name: '404'})
            }
          }
        })
        .catch(async () => await $router.push({ name: '404' }));
    };

    watch(
      () => route.params.name,
      (name) => {
        setActiveChannel(name as string);
      }
    );

    onMounted(() => {
      setActiveChannel(route.params.name as string);
    });

    const state = reactive({
      userBannerIcon: 'expand_more',
      isBrowseChannelsOpen: false,
    });

    return {
      state,
      invitations: computed(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return $store.getters['invitations/getInvitations'] as Invitation[];
      }),
      user: computed(() => $store.state.auth.user),
      toggleUserBannerIcon: () =>
        (state.userBannerIcon =
          state.userBannerIcon === 'expand_more'
            ? 'expand_less'
            : 'expand_more'),
      channels: computed(() => {
        return $store.state.channels_v2.channels;
      }),
      showBrowseChannels: () => (state.isBrowseChannelsOpen = true),
    };
  },
});
</script>
