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
        <q-banner v-if="serverError" inline-actions class="text-white bg-red">
          {{ serverError.message }}
        </q-banner>
        <h3 class="self-center" style="font-size: 1.5rem">
          Create a new
          {{ `${state.isChannelPublic ? 'public' : 'private'}` }} channel
        </h3>
        <q-card-section class="col q-pa-none q-mx-sm q-mt-none">
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
          <q-form @submit.prevent.stop="handleSubmit">
            <q-input
              v-model="state.name"
              :error="v$.name.$error || !!state.serverErrors?.name"
              class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
              color="cyan-9"
              borderless
              type="text"
              name="name"
              @keyup="clearServerError(state.serverErrors, 'name')"
              bottom-slots
              label="Name"
            >
              <template v-slot:prepend>
                <q-icon :name="`${state.isChannelPublic ? 'tag' : 'lock'}`" />
              </template>
              <template v-slot:error>
                <div :key="error.$uid" v-for="error of v$.name.$errors">
                  {{ error.$message }}
                </div>
                <div
                  :key="index"
                  v-for="(error, index) of state.serverErrors.name"
                >
                  {{ error }}
                </div>
              </template>
            </q-input>

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
              label="Create channel"
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
import { computed, defineComponent, reactive, toRef } from 'vue';
import { useStore } from '../store';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import {
  ChannelType,
  CreateChannelRequest,
  ServerError,
  ServerErrors,
  User,
  ValidationError,
} from 'src/contracts';
import { groupValidationErrors, clearServerError, notifyUserPositive } from 'src/utils/utils';

const doesTheNameContainSpace = (value: string) => {
  return !(value.indexOf(' ') >= 0);
};

const rules = {
  name: {
    required: helpers.withMessage("Channel name can't be empty", required),
    doesTheNameContainSpace: helpers.withMessage(
      "Channel name can't contain space",
      doesTheNameContainSpace
    ),
  },
};

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
      name: '',
      isChannelPublic: true,
      serverErrors: {} as ServerErrors,
    });

    const submitting = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['createChannel/isSubmitting'] as boolean
    );
    const validationErrors = computed(
      () =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        $store.getters['createChannel/getValidationErrors'] as ValidationError[]
    );

    const v$ = useVuelidate(rules, state);

    const handleCloseButton = () => {
      emit('close');

      state.invitations = []
      state.name = ''
      state.isChannelPublic = true
      state.serverErrors = {}

      v$.value?.$reset()
    };

    const userOptions = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['invitations/getUserOptions'] as User[]
    );

    const fetchUsers = (val: string, update: (value: () => void) => void) => {
      setTimeout(() => {
        update(() => {
          const needle = val.toLowerCase();
          $store
            .dispatch('invitations/getUserOptions', needle)
            .catch(console.log);
        });
      }, 500);
    };

    const handleSubmit = () => {
      v$.value
        .$validate()
        .then((result) => {
          if (result) {
            const payload: CreateChannelRequest = {
              name: state.name,
              type: state.isChannelPublic
                ? ChannelType.Public
                : ChannelType.Private,
              invitations: !!state.invitations.length
                ? state.invitations.map((user) => user.id)
                : undefined,
            };

            $store
              .dispatch('createChannel/create', payload)
              .then(() => {
                notifyUserPositive(`Channel ${payload.name} was created successfully`)
                handleCloseButton();
              })
              .catch(() => {
                state.serverErrors = groupValidationErrors(
                  validationErrors.value
                );
              });
          }
        })
        .catch(console.log);
    };

    return {
      isDialogOpen,
      clearServerError,
      submitting,
      handleSubmit,
      handleCloseButton,
      state,
      v$,
      fetchUsers,
      userOptions,
      serverError: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['createChannel/getServerError'] as ServerError | null
      ),
    };
  },
});
</script>
