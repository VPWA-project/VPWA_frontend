<template>
  <q-dialog v-model="isDialogOpen" maximized full-width full-height>
    <q-card class="full-height full-height">
      <div style="max-width: 800px; margin-left: auto; margin-right: auto">
        <q-card-section class="flex-center row justify-between">
          <q-btn
            flat
            color="primary"
            @click="handleCloseButton"
            label="Cancel"
          />
          <h3 style="font-size: 1.5rem">Channels</h3>
          <q-btn
            flat
            color="primary"
            label="Create"
            @click="createChannelOpen = true"
          />
        </q-card-section>

        <q-separator inset />

        <q-card-section class="col q-pb-none">
          <q-input
            outlined
            bottom-slots
            v-model="searchText"
            label="Search channel"
            @keydown="clearTimer"
            @keyup="clearTimer"
            @focus="(e) => search()"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                @click="handleClearSearchText"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-separator inset />

        <div v-show="showSpinner" class="row flex-center q-mt-md">
          <q-spinner color="primary" size="3em" />
        </div>

        <q-card-section class="col q-pt-none">
          <ChannelLink
            v-for="link in availableChannels"
            :key="link.id"
            v-bind="link"
          >
            <template v-slot:append>
              <div class="row justify-end">
                <q-btn flat color="black" label="View" />
                <q-btn
                  flat
                  color="green"
                  label="Join"
                  @click="joinChannel(link)"
                />
              </div>
            </template>
          </ChannelLink>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>

  <CreateChannel :open="createChannelOpen" @close="createChannelOpen = false" />
</template>

<script lang="ts">
import { Channel } from 'src/store/channels/state';
import { SearchPublicChannelsPayload } from 'src/store/channels/types';
import { defineComponent, ref, toRef, computed } from 'vue';
import { useStore } from '../store';
import ChannelLink from './ChannelLink.vue';
import CreateChannel from './CreateChannel.vue';

export default defineComponent({
  props: {
    open: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    open(_, newValue) {
      if (newValue === false) {
        this.searchText = '';
      }
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isDialogOpen = toRef(props, 'open');
    const $store = useStore();
    const searchText = ref<string>('');
    const timer = ref<NodeJS.Timeout>();
    const showSpinner = ref<boolean>(false);
    const createChannelOpen = ref<boolean>(false);

    const clearTimer = () => {
      clearTimeout(timer.value as NodeJS.Timeout);
      timer.value = setTimeout(search, 1000);
      showSpinner.value = true;
    };

    const handleClearSearchText = () => {
      searchText.value = '';
      search();
    };

    const search = () => {
      showSpinner.value = true;

      const payload: SearchPublicChannelsPayload = {
        searchText: searchText.value,
      };
      $store
        .dispatch('channels/searchPublicChannels', payload)
        .then(() => {
          showSpinner.value = false;
        })
        .catch((err) => {
          console.log(err);
          showSpinner.value = false;
        });
    };

    const joinChannel = (channel: Channel) => {
      $store
        .dispatch('channels/joinChannel', channel)
        .then(() => {
          $store
            .dispatch('channels/removeFromPublicChannels', channel.id)
            .catch(console.log);
        })
        .catch(console.log);
    };

    return {
      isDialogOpen,
      showSpinner,
      searchText,
      timer,
      createChannelOpen,
      search,
      clearTimer,
      handleClearSearchText,
      joinChannel,
      availableChannels: computed(
        () => $store.state.channels.availableChannels
      ),
      handleCloseButton: () => emit('close'),
    };
  },
  components: { ChannelLink, CreateChannel },
});
</script>
