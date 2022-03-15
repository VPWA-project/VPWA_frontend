<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <Header
      :toggleLeftDrawer="toggleLeftDrawer"
      :activeChannel="activeChannel?.name"
      />
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <div clickable @click="changeMe" class="row justify-between cursor-pointer">
          <UserMenu />
          <UserBanner v-if="user.loggedInUser" v-bind="user.loggedInUser">
            <template v-slot:append>
              <q-item-section avatar>
                <q-icon :name="btnIcon" size="1.4em" />
              </q-item-section>
            </template>
          </UserBanner>
        </div>

        <q-separator spaced inset />

        <q-item>
          <q-item-section>
            <q-item-label>Invitations</q-item-label>
          </q-item-section>
        </q-item>

        <q-scroll-area style="height: calc(80px)">
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
        </q-scroll-area>

        <q-item>
          <q-item-section>
            <q-item-label>Channels</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn round flat icon="add_circle" @click="showBrowseChannels" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-scroll-area style="height: calc(100% - 190px)">
        <q-list>
          <ChannelLink
            v-for="link in channels"
            :key="link.id"
            v-bind="link"
            @click="switchChannel(link)"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label class="text-grey-7">Online</q-item-label>
          </q-item-section>
        </q-item>

        <UserBanner
          firstname="Frido"
          lastname="Herak"
          nickname="cigan123"
          status="ONLINE"
        />

        <q-item>
          <q-item-section>
            <q-item-label class="text-grey-7">Offline</q-item-label>
          </q-item-section>
        </q-item>

        <UserBanner
          firstname="Frido"
          lastname="Herak"
          nickname="cigan123"
          status="OFFLINE"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <SearchChannels
      :open="browseChannelsOpen"
      @close="browseChannelsOpen = false"
    />

    <q-footer>
      <MessageForm />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from '../store';
import ChannelLink from 'src/components/ChannelLink.vue';
import SearchChannels from 'src/components/SearchChannels.vue';
import {
  Channel,
  InvitationState,
  InvitationInfo,
} from 'src/store/channels/state';
import { UserStatus } from 'src/store/user/state';
import MessageForm from 'src/components/MessageForm.vue';
import UserBanner from '../components/UserBanner.vue';
import Header from 'src/components/Header.vue';
import UserMenu from 'src/components/UserMenu.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    ChannelLink,
    SearchChannels,
    MessageForm,
    UserBanner,
    Header,
    UserMenu
},

  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const browseChannelsOpen = ref(false);
    const allowOnlyMentions = ref(true);

    const btnIcon = ref('expand_more');

    const $store = useStore();

    const showBrowseChannels = () => {
      browseChannelsOpen.value = true;
    };

    const switchChannel = (channel: Channel) => {
      $store.dispatch('channels/setActiveChannel', channel).catch(console.log);
    };

    return {
      btnIcon,
      message: '',
      leftDrawerOpen,
      rightDrawerOpen,
      browseChannelsOpen,
      allowOnlyMentions,
      confirm: ref(false),
      user: computed(() => $store.state.user),
      UserStatus,
      InvitationState,

      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      /*
      userGetter: computed<string>(() => {
        return $store.getters.userGetter;
      }),
      */

      channels: computed(() => {
        return $store.state.channels.channels;
      }),
      activeChannel: computed(() => {
        return $store.state.channels.activeChannel;
      }),
      processInvitation: (inv: InvitationInfo) => {
        $store.dispatch('channels/processInvitation', inv).catch(console.log);
      },
      showBrowseChannels,
      switchChannel,
      invitations: computed(() => {
        return $store.state.channels.invitations;
      }),
    };
  },
});
</script>
