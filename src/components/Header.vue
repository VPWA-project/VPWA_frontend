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
      {{ activeChannel }}
    </q-toolbar-title>

    <q-btn flat dense round icon="more_vert" class="q-ml-md">
      <q-menu fit anchor="bottom right" self="top right">
        <q-list class="column q-gutter-sm" style="width: 150px">
          <q-item
            clickable
            @click="toggleDialog(ConfirmDialogType.Leave)"
            v-close-popup
          >
            <q-item-section>
              <q-item-label>Leave channel</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="toggleDialog(ConfirmDialogType.Delete)"
            v-close-popup
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
import { useStore } from 'src/store';
import { defineComponent, reactive, PropType, computed } from 'vue';

enum ConfirmDialogType {
  Leave,
  Delete,
}

export default defineComponent({
  props: {
    toggleLeftDrawer: Function as PropType<() => void>,
    toggleRightDrawer: Function as PropType<() => void>,
    activeChannel: String,
  },
  setup() {
    const $store = useStore();

    const state = reactive({
      isConfirmDialogOpen: false,
      confirmDialogType: ConfirmDialogType.Leave,
    });

    return {
      state,
      ConfirmDialogType,
      confirmDialog: () => {
        if (state.confirmDialogType === ConfirmDialogType.Leave) {
          $store
            .dispatch(
              'channels/leaveChannel',
              $store.state.channels.activeChannel
            )
            .catch(console.log);
        } else if (state.confirmDialogType === ConfirmDialogType.Delete) {
          // TODO: Delete channel
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
    };
  },
});
</script>
