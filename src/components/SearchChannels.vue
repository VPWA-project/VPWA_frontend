<template>
  <q-dialog
    v-model="isDialogOpen"
    :full-width="$q.screen.lt.sm"
    :full-height="$q.screen.lt.sm"
    :maximized="$q.screen.lt.sm"
  >
    <q-card class="full-height full-width bg-grey-3 border-15">
      <div
        class="column q-pa-md q-gutter-y-md"
        style="max-width: 800px; margin-left: auto; margin-right: auto"
      >
        <q-btn
          class="self-end bg-white q-px-sm border-15"
          color="black"
          clickable
          flat
          @click="handleCloseButton"
          icon="close"
        />
        <h3 class="self-center" style="font-size: 1.5rem">Channels</h3>

        <q-card-section class="col q-pa-none q-mx-sm q-mt-none">
          <q-btn
            class="bg-white q-mt-none border-15"
            color="black"
            clickable
            flat
            no-caps
            icon="add_circle_outline"
            label="Create new channel"
            @click="createChannelOpen = true"
          />
          <q-input
            class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
            color="cyan-9"
            borderless
            bottom-slots
            v-model="searchText"
            label="Search channel"
            @keydown="clearTimer"
            @keyup="clearTimer"
            @focus="() => search()"
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

        <div v-show="showSpinner" class="row flex-center q-mt-md">
          <q-spinner color="cyan-9" size="3em" />
        </div>

        <q-card-section class="col q-pa-none">
          <ChannelLink
            v-for="link in availableChannels"
            :key="link.id"
            v-bind="link"
          >
            <template v-slot:append>
              <div class="row justify-end">
                <q-btn
                  flat
                  color="green"
                  label="Join"
                  @click.prevent.stop="joinChannel(link)"
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
import { AxiosError } from 'axios';
import { Channel, SearchPublicChannelsRequest } from 'src/contracts/Channel';
import { notifyUserNegative, notifyUserPositive } from 'src/utils/utils';
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

      const payload: SearchPublicChannelsRequest = {
        searchText: searchText.value,
        userId: $store.state.auth.user?.id,
      };

      $store
        .dispatch('searchChannels/searchPublicChannels', payload)
        .then(() => {
          showSpinner.value = false;
        })
        .catch((err: AxiosError) => {
          console.log(err);
          showSpinner.value = false;

          notifyUserNegative(err.message)
        });
    };

    const joinChannel = async (channel: Channel) => {
      await $store
        .dispatch('channels_v2/joinChannel', channel.id)
        .then(
          async () => {
            void await $store.dispatch(
              'searchChannels/removePublicChannel',
              channel.id
            )
            notifyUserPositive(`Successfully joined to the ${channel.name} channel`)
          }
        ).catch((err: AxiosError) => {
          console.log(err)

          notifyUserNegative(err.message)
        });
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['searchChannels/getPublicChannels'] as Channel[]
      ),
      handleCloseButton: () => emit('close'),
    };
  },
  components: { ChannelLink, CreateChannel },
});
</script>
