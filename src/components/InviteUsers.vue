<template>
  <q-dialog
    v-model="isDialogOpen"
    :full-width="$q.screen.lt.sm"
    :full-height="$q.screen.lt.sm"
    :maximized="$q.screen.lt.sm"
  >
    <q-card class="full-height full-width bg-grey-3 border-15">
      <div style="max-width: 800px; margin-left: auto; margin-right: auto">
        <q-card-section class="flex-center col">
          <div class="row flex-center justify-between no-wrap">
            <h3 style="font-size: 1.5rem">Invite new users</h3>
            <q-btn
              round
              flat
              color="black"
              icon="close"
              @click="handleCloseButton"
            />
          </div>
        </q-card-section>

        <q-card-section class="col q-pt-none">
          <q-form @submit.prevent.stop="handleSubmit">
            <q-select
              v-model="invitations"
              use-input
              use-chips
              multiple
              stack-label
              input-debounce="0"
              label="Invitations"
              class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
              color="cyan-9"
              borderless
              :options="options"
              @filter="fetchUsers"
            >
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
              :loading="state.submitting"
              flat
              label="Invite user"
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
import { QSelect } from 'quasar';
import { defineComponent, reactive, ref, toRef } from 'vue';

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
        this.state.submitting = false;
      }
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isDialogOpen = toRef(props, 'open');

    const state = reactive({
      submitting: false,
    });

    const handleCloseButton = () => {
      emit('close');
    };

    const stringOptions = ['sangalaa', 'adam', '5cos', 'lucyklus', 'stuff'];

    const invitations = ref<QSelect | null>(null);
    const options = ref(stringOptions);

    const fetchUsers = (val: string, update: (value: () => void) => void) => {
      setTimeout(() => {
        update(() => {
          if (val === '') {
            options.value = stringOptions;
          } else {
            const needle = val.toLowerCase();
            options.value = stringOptions.filter(
              (v) => v.toLowerCase().indexOf(needle) > -1
            );
          }
        });
      }, 1500);
    };

    const handleSubmit = () => {
      state.submitting = true;
    };

    return {
      isDialogOpen,
      handleSubmit,
      handleCloseButton,
      state,
      invitations,
      options,
      fetchUsers,
    };
  },
});
</script>
