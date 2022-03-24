<template>
  <q-dialog
    v-model="isDialogOpen"
    :full-width="$q.screen.lt.sm"
    :full-height="$q.screen.lt.sm"
    :maximized="$q.screen.lt.sm"
  >
    <q-card
      class="full-height full-width bg-grey-3 rounded-borders border-all-15"
    >
      <div style="max-width: 800px; margin-left: auto; margin-right: auto">
        <q-card-section class="flex-center col">
          <div class="row flex-center justify-between no-wrap">
            <h3 style="font-size: 1.5rem">
              Create a new
              {{ `${state.isChannelPublic ? 'public' : 'private'}` }} channel
            </h3>
            <q-btn
              round
              flat
              color="black"
              icon="close"
              @click="handleCloseButton"
            />
          </div>
          <q-toggle
            :label="`${
              state.isChannelPublic
                ? 'Anyone can join'
                : 'Restricted to invited members'
            }`"
            v-model="state.isChannelPublic"
            keep-color
            :color="`${state.isChannelPublic ? 'cyan-9' : 'blue-grey'}`"
          />
          <p class="text-grey-7" v-show="!state.isChannelPublic">
            A private channel is only visible to its members and only members of
            private channel can read its content.
          </p>
        </q-card-section>

        <q-card-section class="col q-pt-none">
          <q-form @submit.prevent.stop="handleSubmit">
            <q-input
              v-model="state.channelName"
              :error="v$.channelName.$error"
              class="q-mt-lg rounded-borders border-all-15 bg-white q-pb-none q-pl-md q-pr-md"
              color="cyan-9"
              borderless
              type="text"
              bottom-slots
              label="Name"
            >
              <template v-slot:prepend>
                <q-icon :name="`${state.isChannelPublic ? 'tag' : 'lock'}`" />
              </template>
              <template v-slot:error>
                <span :key="error.$uid" v-for="error of v$.channelName.$errors">
                  {{ error.$message }}
                </span>
              </template>
            </q-input>

            <q-select
              v-model="invitations"
              use-input
              use-chips
              multiple
              stack-label
              input-debounce="0"
              label="Invitations"
              class="q-mt-lg rounded-borders border-all-15 bg-white q-pb-none q-pl-md q-pr-md"
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
              label="Create channel"
              class="rounded-borders q-mt-lg bg-white border-all-15"
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
import { QSelect, useQuasar } from 'quasar';
import { ChannelType } from 'src/store/channels/state';
import { CreateChannelPayload } from 'src/store/channels/types';
import { defineComponent, reactive, ref, toRef } from 'vue';
import { useStore } from '../store';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

const rules = {
  channelName: {
    required: helpers.withMessage("Channel name can't be empty", required),
  },
};

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
        this.state.channelName = '';
        this.state.isChannelPublic = true;
        this.state.submitting = false;
      }
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isDialogOpen = toRef(props, 'open');

    const $store = useStore();
    const $q = useQuasar();

    const state = reactive({
      channelName: '',
      isChannelPublic: true,
      submitting: false,
    });

    const v$ = useVuelidate(rules, state);

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

      v$.value
        .$validate()
        .then((result) => {
          if (result) {
            const payload: CreateChannelPayload = {
              name: state.channelName,
              type: state.isChannelPublic
                ? ChannelType.Public
                : ChannelType.Private,
            };

            $store
              .dispatch('channels/createChannel', payload)
              .then(() => {
                $q.notify({
                  message: `Channel ${payload.name} was created successfully`,
                  color: 'blue',
                });

                state.submitting = false;

                handleCloseButton();
              })
              .catch(console.log);
          } else {
            state.submitting = false;
          }
        })
        .catch(console.log);
    };

    return {
      isDialogOpen,
      handleSubmit,
      handleCloseButton,
      state,
      v$,
      invitations,
      options,
      fetchUsers,
    };
  },
});
</script>

<style scoped>
.border-all-15 {
  border-radius: 15px;
}
</style>
