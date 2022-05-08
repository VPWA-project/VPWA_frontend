<template>
  <q-toolbar style="height: 56px">
    <q-btn
      v-if="toggleLeftDrawer"
      flat
      dense
      round
      icon="menu"
      @click="toggleLeftDrawer"
    />
    <q-toolbar-title>
      {{ activeChannel?.name }}
    </q-toolbar-title>

    <q-btn
      v-if="amIChannelMember"
      flat
      dense
      round
      icon="more_vert"
      class="q-ml-md"
    >
      <q-menu
        anchor="bottom right"
        self="top right"
        style="border-radius: 15px"
      >
        <q-list class="column q-gutter-sm" style="width: 150px">
          <q-item clickable @click="toggleDialog()" v-close-popup>
            <q-item-section>
              <q-item-label>{{ confirmDialogButtonText }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn
      v-if="toggleRightDrawer"
      flat
      dense
      round
      icon="menu"
      @click="toggleRightDrawer"
    >
    </q-btn>
    <q-dialog v-model="state.isConfirmDialogOpen">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="group_off" color="primary" text-color="white" />
          <span class="q-ml-sm">{{ confirmDialogText }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            :label="confirmDialogButtonText"
            color="primary"
            @click="confirmDialog"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-toolbar>
</template>

<script lang="ts">
import { Channel } from 'src/contracts';
import { useStore } from 'src/store';
import { defineComponent, reactive, PropType, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    toggleLeftDrawer: Function as PropType<() => void>,
    toggleRightDrawer: Function as PropType<() => void>,
  },
  setup() {
    const $store = useStore();
    const router = useRouter();

    const state = reactive({
      isConfirmDialogOpen: false,
    });

    const amIChannelAdmin = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/amIChannelAdmin'] as boolean
    );

    const activeChannel = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
    );

    return {
      state,
      confirmDialog: async () => {
        if (!activeChannel.value) return;
        await $store
          .dispatch('channels_v2/leaveChannel', activeChannel.value.name)
          .then(() => router.push({ name: 'home' }));
      },
      toggleDialog: () => {
        state.isConfirmDialogOpen = !state.isConfirmDialogOpen;
      },
      confirmDialogText: computed(() => {
        return amIChannelAdmin.value
          ? 'Do you really want to delete this channel?'
          : 'Do you really want to leave this channel?';
      }),
      confirmDialogButtonText: computed(() => {
        return amIChannelAdmin.value ? 'Delete channel' : 'Leave channel';
      }),
      activeChannel: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
      ),
      amIChannelMember: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['channels_v2/amIChannelMember'] as boolean
      ),
      amIChannelAdmin,
    };
  },
});
</script>
