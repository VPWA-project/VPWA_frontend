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
        <h3 class="self-center" style="font-size: 1.5rem">Invite new users</h3>

        <q-card-section class="col q-pa-none q-mx-sm q-mt-none">
          <q-form @submit.prevent.stop="handleSubmit">
            <q-select
              v-model="state.invitations"
              use-input
              use-chips
              multiple
              stack-label
              input-debounce="0"
              label="Invitations"
              class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
              color="cyan-9"
              borderless
              :options="userOptions"
              @filter="fetchUsers"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    {{ scope.opt.nickname }}
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <q-chip
                  @remove="scope.removeAtIndex(scope.index)"
                  dense
                  class="text-cyan-9"
                  color="text-cyan-9"
                  removable
                  >{{ scope.opt.nickname }}</q-chip
                >
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    User not found
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-btn
              type="submit"
              :loading="submitting"
              flat
              :disable="!state.invitations.length"
              label="Invite users"
              class="q-mt-lg bg-white border-15"
              color="black"
              clickable
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </q-form>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { User } from 'src/contracts';
import { useStore } from 'src/store';
import { Channel } from 'src/store/channels/state';
import { computed, defineComponent, reactive, toRef } from 'vue';

export default defineComponent({
  props: {
    open: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isDialogOpen = toRef(props, 'open');
    const $store = useStore();

    const state = reactive({
      invitations: [] as User[],
    });

    const handleCloseButton = () => {
      emit('close');
      
      state.invitations = []
    };

    const submitting = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['invitations/isSubmitting'] as boolean
    );

    const userOptions = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['invitations/getUserOptions'] as User[]
    );

    const activeChannel = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['channels_v2/getActiveChannel'] as Channel | null
    );

    const fetchUsers = (val: string, update: (value: () => void) => void) => {
      if(!activeChannel.value) return

      setTimeout(() => {
        update(() => {
          const needle = val.toLowerCase();
          $store
            .dispatch('invitations/getChannelUserOptions', {
              channelId: activeChannel.value?.id,
              search: needle,
            })
            .catch(console.log);
        });
      }, 500);
    };

    const handleSubmit = async () => {
      if (!activeChannel.value) return;

      await $store.dispatch('invitations/invite', {
        channelId: activeChannel.value.id,
        userIds: state.invitations.map((user) => user.id),
      });

      handleCloseButton();
    };

    return {
      isDialogOpen,
      handleSubmit,
      handleCloseButton,
      state,
      userOptions,
      submitting,
      fetchUsers,
    };
  },
});
</script>
