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
import { defineComponent, computed, reactive } from 'vue';
import UserMenu from './UserMenu.vue';
import UserBanner from './UserBanner.vue';
import ChannelLink from './ChannelLink.vue';
import SearchChannels from './SearchChannels.vue';
import InvitationLink from './InvitationLink.vue';
import { Invitation } from 'src/contracts';

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
