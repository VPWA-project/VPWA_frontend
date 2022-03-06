<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="height: 56px">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Channel name </q-toolbar-title>
        <q-btn flat dense round icon="more_vert" clickable @click="changeMe">
          <q-menu fit anchor="bottom right" self="top right">
            <div class="q-gutter-sm">
              <q-btn
                label="Leave channel"
                color="white"
                text-color="black"
                @click="confirm = true"
              />
              <q-dialog v-model="confirm" persistent>
                <q-card>
                  <q-card-section class="row items-center">
                    <q-avatar
                      icon="group_off"
                      color="primary"
                      text-color="white"
                    />
                    <span class="q-ml-sm"
                      >Do you really want to leave this channel ?</span
                    >
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn
                      flat
                      label="Leave channel"
                      color="primary"
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable @click="changeMe">
          <q-menu fit anchor="bottom left" self="top left">
            <q-list>
              <q-item class="no-padding">
                <q-item-label class="q-pa-md text-grey-7"
                  >Your status</q-item-label
                >
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon name="circle" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Online</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon name="remove_circle_outline" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>DND</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon name="circle" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Offline</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced inset />

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Settings</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>

          <q-item-section avatar>
            <q-avatar rounded color="primary" text-color="white"
              >{{ nameInitials }}<q-badge color="red" rounded floating
            /></q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ userName }}</q-item-label>
            <q-item-label caption>{{ userNickName }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon :name="btnIcon" size="1.4em" />
          </q-item-section>
        </q-item>

        <q-separator spaced inset />

        <q-item>
          <q-item-section>
            <q-item-label>Invitations</q-item-label>
          </q-item-section>
        </q-item>

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

    <q-page-container>
      <router-view />
    </q-page-container>

    <SearchChannels
      :open="browseChannelsOpen"
      @close="browseChannelsOpen = false"
    />

    <q-footer>
      <q-toolbar class="bg-grey-3 text-black row">
        <q-input
          rounded
          outlined
          dense
          class="WAL__field col-grow q-mr-sm"
          bg-color="white"
          v-model="message"
          placeholder="Type a message"
        />
        <q-btn round flat icon="send" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from '../store';
import ChannelLink from 'src/components/ChannelLink.vue';
import SearchChannels from 'src/components/SearchChannels.vue';
import { Channel } from 'src/store/channels/state';

export default defineComponent({
  name: 'MainLayout',

  components: {
    ChannelLink,
    SearchChannels,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const browseChannelsOpen = ref(false);

    const btnIcon = ref('expand_more');

    const $store = useStore();

    const showBrowseChannels = () => {
      browseChannelsOpen.value = true;
    };

    const switchChannel = (channel: Channel) => {
      return;
    };

    return {
      btnIcon,
      message: '',
      leftDrawerOpen,
      browseChannelsOpen,
      confirm: ref(false),
      user: computed(() => $store.state.user),

      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      changeMe() {
        if (btnIcon.value == 'expand_more') {
          btnIcon.value = 'expand_less';
        } else {
          btnIcon.value = 'expand_more';
        }
      },

      nameInitials: computed(() => {
        const firstName: string = $store.state.user.firstname as string;
        const lastName: string = $store.state.user.lastname as string;
        return firstName[0] + lastName[0];
      }),

      userNickName: computed(() => {
        const nickName: string = $store.state.user.nickname as string;
        return '@' + nickName;
      }),

      userName: computed(() => {
        const firstName: string = $store.state.user.firstname as string;
        const lastName: string = $store.state.user.lastname as string;
        return firstName + ' ' + lastName;
      }),

      /*
      userGetter: computed<string>(() => {
        return $store.getters.userGetter;
      }),
      */

      channels: computed(() => {
        return $store.state.channels.channels;
      }),
      showBrowseChannels,
      switchChannel,
    };
  },
});
</script>
