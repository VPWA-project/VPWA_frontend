<template>
    <q-dialog v-model="isSearchChannelDialogOpen" maximized full-width full-height>
      <q-card class="full-height full-height">
        <q-card-section class="flex-center row justify-between">
          <q-btn flat color="primary" v-close-popup label="Cancel" />
          <h3 style="font-size: 1.5rem">Channels</h3>
          <q-btn
            flat
            color="primary"
            label="Create"
            @click="notifyCreateButtonClicked"
          />
        </q-card-section>

        <q-separator inset />

        <q-card-section class="col q-pb-none">
          <q-input outlined bottom-slots v-model="searchText" label="Label">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon name="close" @click="searchText = ''" class="cursor-pointer" />
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup(_, { emit }) {
        const isSearchChannelDialogOpen = ref<boolean>(false)
        const searchText = ref<string>('');

        const notifyCreateButtonClicked = () => {
            emit('create-button-clicked', isSearchChannelDialogOpen)
        }

        return {
            isSearchChannelDialogOpen,
            searchText,
            notifyCreateButtonClicked
        }
    },
})
</script>
