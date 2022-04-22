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
          <q-item
            clickable
            @click="toggleDialog(ConfirmDialogType.Leave)"
            v-close-popup
            v-if="!amIChannelAdmin"
          >
            <q-item-section>
              <q-item-label>Leave channel</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="toggleDialog(ConfirmDialogType.Delete)"
            v-close-popup
            v-else
          >
            <q-item-section>
              <q-item-label>Delete channel</q-item-label>
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

enum ConfirmDialogType {
  Leave,
  Delete,
}

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
      confirmDialogType: ConfirmDialogType.Leave,
    });

    const amIChannelAdmin = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/amIChannelAdmin'] as boolean
    );

    const activeChannel = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
    );

    const amIChannelMember = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/amIChannelMember'] as boolean
    );

    console.log('Am I channel member: ', amIChannelMember.value);

    return {
      state,
      ConfirmDialogType,
      confirmDialog: async () => {
        if (!activeChannel.value) return;

        if (state.confirmDialogType === ConfirmDialogType.Leave) {
          // TODO: leave channel
          // $store
          //   .dispatch(
          //     'channels/leaveChannel',
          //     $store.state.channels.activeChannel
          //   )
          //   .then(() => {
          //     router.push({ name: 'dashboard' }).catch(console.log);
          //   })
          //   .catch(console.log);
        } else if (state.confirmDialogType === ConfirmDialogType.Delete) {
          await $store
            .dispatch('channels_v2/delete', activeChannel.value.name)
            .then(() => router.push({ name: 'home' }));
        }
      },
      toggleDialog: (type: ConfirmDialogType) => {
        state.isConfirmDialogOpen = !state.isConfirmDialogOpen;
        state.confirmDialogType = type;
      },
      confirmDialogText: computed(() => {
        if (state.confirmDialogType === ConfirmDialogType.Leave) {
          return 'Do you really want to leave this channel ?';
        }
        if (state.confirmDialogType === ConfirmDialogType.Delete) {
          return 'Do you really want to delete this channel?';
        }
        return '';
      }),
      confirmDialogButtonText: computed(() => {
        if (state.confirmDialogType === ConfirmDialogType.Leave) {
          return 'Leave channel';
        }
        if (state.confirmDialogType === ConfirmDialogType.Delete) {
          return 'Delete channel';
        }
        return '';
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
