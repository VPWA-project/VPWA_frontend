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
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable>
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
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Jozko Mrkvička</q-item-label>
            <q-item-label caption>@jozomrkva</q-item-label>
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
            <q-btn round flat icon="add_circle" @click="toggleChannelList" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-scroll-area style="height: calc(100% - 190px)">
        <q-list>
          <ChannelLink
            v-for="link in channels"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="dialog" maximized full-width full-height>
      <q-card class="full-height full-height">
        <q-card-section class="flex-center row justify-between">
          <q-btn flat color="primary" v-close-popup label="Cancel" />
          <h3 style="font-size: 1.5rem">Channels</h3>
          <q-btn
            flat
            color="primary"
            label="Create"
            @click="openCreateChannelDialog"
          />
        </q-card-section>

        <q-separator inset />

        <q-card-section class="col q-pb-none">
          <q-input outlined bottom-slots v-model="text" label="Label">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon name="close" @click="text = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </q-card-section>

        <q-separator inset />

        <q-card-section class="col q-pt-none">
          <ChannelLink title="Channel 1" icon="lock" />
          <ChannelLink title="Channel 2" icon="lock" />
          <ChannelLink title="Channel 3" icon="lock" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="createChannelDialog" maximized full-width full-height>
      <q-card class="full-height full-height">
        <q-card-section class="flex-center col">
          <h3 style="font-size: 1.5rem">Create a new {{ `${isPublicChannel ? 'public' : 'private'}` }} channel</h3>
          <q-toggle
            :label="`${isPublicChannel ? 'Anyone can join' : 'Restricted to invited members'}`"
            v-model="isPublicChannel"
          />
          <p class="text-grey-7" v-if="!isPublicChannel">A private channel is only visible to its members and only members of private channel can read its content.</p>
        </q-card-section>

        <q-separator inset />

        <q-card-section class="col q-pb-none">
          <q-input
            class="q-mt-lg"
            outlined
            label="Channel name"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

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
import ChannelLink from 'src/components/ChannelLink.vue';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    ChannelLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const channels = ref([
      {
        title: 'Channel 1',
        icon: 'tag',
      },
      {
        title: 'Channel 2',
        icon: 'lock',
      },
    ]);

    const dialog = ref(false);
    const createChannelDialog = ref(false);
    const isPublicChannel = ref(true)

    return {
      channels,
      dialog,
      createChannelDialog,
      isPublicChannel,
      message: '',
      messages: [],
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      toggleChannelList() {
        dialog.value = !dialog.value;
      },
      toggleCreateChannelDialog() {
        createChannelDialog.value = !createChannelDialog.value;
      },
      openCreateChannelDialog() {
        dialog.value = !dialog.value;
        createChannelDialog.value = !createChannelDialog.value;
      },
      createChannel() {
        channels.value.push({
          title: 'Picovina',
          icon: 'lock',
        });
      },
    };
  },
});
</script>
