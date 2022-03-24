<template>
  <q-list>
    <q-item
      clickable
      @click="toggleUserBannerIcon"
      class="row cursor-pointer no-padding"
    >
      <UserMenu />
      <UserBanner v-if="user.loggedInUser" v-bind="user.loggedInUser">
        <template v-slot:append>
          <q-item-section avatar>
            <q-icon :name="state.userBannerIcon" size="1.4em" />
          </q-item-section>
        </template>
      </UserBanner>
    </q-item>

    <div class="q-ma-md q-py-md bg-grey-2 border-15 rounded-borders">
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium text-subtitle1"
            >Invitations</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-list>
        <ChannelLink
          v-for="link in invitations"
          :id="link.id"
          :key="link.id"
          :name="link.channel.name"
          :type="link.channel.type"
          ><template v-slot:append>
            <div class="flex justify-end q-gutter-sm">
              <q-btn
                round
                size="sm"
                color="red"
                icon="highlight_off"
                @click="
                  processInvitation({
                    id: link.id,
                    state: InvitationState.Refuse,
                  })
                "
              />
              <q-btn
                round
                size="sm"
                color="green"
                icon="check_circle_outline"
                @click="
                  processInvitation({
                    id: link.id,
                    state: InvitationState.Accept,
                  })
                "
              />
            </div> </template
        ></ChannelLink>
      </q-list>
    </div>

    <div class="q-ma-md q-py-md bg-grey-2 border-15 rounded-borders">
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium text-subtitle1"
            >Channels</q-item-label
          >
        </q-item-section>
        <q-item-section avatar>
          <div>
            <q-btn
              class="rounded-borders bg-white q-px-sm border-15"
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
import {
  Channel,
  InvitationInfo,
  InvitationState,
} from 'src/store/channels/state';
import { defineComponent, computed, reactive, watch, onMounted } from 'vue';
import UserMenu from './UserMenu.vue';
import UserBanner from './UserBanner.vue';
import ChannelLink from './ChannelLink.vue';
import SearchChannels from './SearchChannels.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    UserMenu,
    UserBanner,
    ChannelLink,
    SearchChannels,
  },
  setup() {
    const $store = useStore();
    const route = useRoute();

    const setActiveChannel = (id: string) => {
      const channel = $store.state.channels.channels.find(
        (channel) => channel.id === parseInt(id)
      );
      $store.dispatch('channels/setActiveChannel', channel).catch(console.log);
    };

    watch(
      () => route.params.id,
      (id) => {
        setActiveChannel(id as string);
      }
    );

    onMounted(() => {
      setActiveChannel(route.params.id as string);
    });

    const state = reactive({
      userBannerIcon: 'expand_more',
      isBrowseChannelsOpen: false,
    });

    return {
      state,
      InvitationState,
      processInvitation: (inv: InvitationInfo) =>
        $store.dispatch('channels/processInvitation', inv).catch(console.log),
      switchChannel: (channel: Channel) =>
        $store
          .dispatch('channels/setActiveChannel', channel)
          .catch(console.log),
      invitations: computed(() => {
        return $store.state.channels.invitations;
      }),
      user: computed(() => $store.state.user),
      toggleUserBannerIcon: () =>
        (state.userBannerIcon =
          state.userBannerIcon === 'expand_more'
            ? 'expand_less'
            : 'expand_more'),
      channels: computed(() => {
        return $store.state.channels.channels;
      }),
      showBrowseChannels: () => (state.isBrowseChannelsOpen = true),
    };
  },
});
</script>

<style scoped>
.border-15 {
  border-radius: 15px;
}
</style>
