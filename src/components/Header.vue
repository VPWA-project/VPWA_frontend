<template>
  <q-toolbar style="height: 56px">
    <q-btn
      flat
      dense
      round
      icon="menu"
      aria-label="Menu"
      @click="toggleLeftDrawer"
    />
    <q-toolbar-title>
      {{ activeChannel }}
    </q-toolbar-title>
    <q-btn flat dense round icon="more_vert" clickable>
      <q-menu fit anchor="bottom right" self="top right">
        <div class="q-gutter-sm">
          <q-btn
            label="Leave channel"
            color="white"
            text-color="black"
            @click="toggleDialog"
          />
          <q-dialog v-model="confirm" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar icon="group_off" color="primary" text-color="white" />
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
                  @click="leaveChannel"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent, reactive, PropType } from 'vue';

export default defineComponent({
  props: {
    toggleLeftDrawer: {
      type: Function as PropType<() => void>,
      required: true,
    },
    activeChannel: String,
  },
  setup() {
    const $store = useStore();

    const state = reactive({
      isConfirmDialogOpen: false,
    });

    return {
      state,
      leaveChannel: () =>
        $store
          .dispatch(
            'channels/leaveChannel',
            $store.state.channels.activeChannel
          )
          .catch(console.log),
      toggleDialog: () =>
        (state.isConfirmDialogOpen = !state.isConfirmDialogOpen),
    };
  },
});
</script>
