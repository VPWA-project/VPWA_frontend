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
              @keyup="clearServerError(state, 'name')"
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
              :options="state.options"
              @filter="fetchUsers"
            >
              <template v-slot:options>
                <q-item :key="option.id" v-for="option in state.options">
                  <q-item-section>
                    {{ option.id }}
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected>
                <div :key="invitation.id" v-for="invitation in invitations">{{ invitation.id }}</div>
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
import { QSelect, useQuasar } from 'quasar';
import { ChannelType } from 'src/store/channels/state';
import { computed, defineComponent, onMounted, reactive, ref, toRef } from 'vue';
import { useStore } from '../store';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { CreateChannelRequest, ServerErrors, User } from 'src/contracts';
import { groupValidationErrors, clearServerError } from 'src/utils/utils';

const rules = {
  name: {
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
        this.state.name = '';
        this.state.isChannelPublic = true;
      }
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isDialogOpen = toRef(props, 'open');

    const $store = useStore();
    const $q = useQuasar();

    const state = reactive({
      name: '',
      isChannelPublic: true,
      serverErrors: {} as ServerErrors,
      options: [] as User[]
    });

    onMounted(() => {
      $store.dispatch('invitations/getUserOptions').catch(console.log)
    })

    const submitting = computed(() => $store.state.createChannel.isSubmitting);

    const v$ = useVuelidate(rules, state);

    const handleCloseButton = () => {
      emit('close');
    };

    const userOptions = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['invitations/getUserOptions'] as User[]
    );

    const invitations = ref<QSelect | null>(null);

    const fetchUsers = (val: string, update: (value: () => void) => void) => {
      setTimeout(() => {
        update(() => {
          if (val === '') {
            state.options = userOptions.value;
            console.log(userOptions.value)
          } else {
            const needle = val.toLowerCase();
            $store.dispatch('invitations/getUserOptions', needle).catch(console.log)
          }
        });
      }, 1500);
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
              invitations: [],
            };

            $store
              .dispatch('createChannel/create', payload)
              .then(() => {
                $q.notify({
                  message: `Channel ${payload.name} was created successfully`,
                  color: 'grey-8',
                  type: 'positive',
                });

                handleCloseButton();
              })
              .catch(() => {
                state.serverErrors = groupValidationErrors(
                  $store.state.createChannel.errors
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
      invitations,
      fetchUsers,
    };
  },
});
</script>
