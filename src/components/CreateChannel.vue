<template>
  <q-dialog v-model="isDialogOpen" maximized full-width full-height>
    <q-card>
      <div style="max-width: 800px; margin-left: auto; margin-right: auto">
        <q-card-section class="flex-center col">
          <div class="row flex-center justify-between">
            <h3 style="font-size: 1.5rem">
              Create a new
              {{ `${isChannelPublic ? 'public' : 'private'}` }} channel
            </h3>
            <q-btn round flat color="black" icon="close" v-close-popup />
          </div>
          <q-toggle
            :label="`${
              isChannelPublic
                ? 'Anyone can join'
                : 'Restricted to invited members'
            }`"
            v-model="isChannelPublic"
            keep-color
            :color="`${isChannelPublic ? 'green' : 'orange'}`"
          />
          <p class="text-grey-7" v-if="!isChannelPublic">
            A private channel is only visible to its members and only members of
            private channel can read its content.
          </p>
        </q-card-section>

        <q-card-section class="col q-pt-none">
          <q-form @submit.prevent.stop="onSubmit">
            <q-input
              ref="channelNameRef"
              v-model="channelName"
              :rules="channelNameRules"
              class="q-mt-lg"
              type="text"
              outlined
              label="Name"
            >
              <template v-slot:prepend>
                <q-icon :name="`${isChannelPublic ? 'tag' : 'lock'}`" />
              </template>
            </q-input>

            <q-btn
              type="submit"
              :loading="submitting"
              flat
              label="Create channel"
              class="q-mt-lg"
              style="color: #ff0080"
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
import { QInput } from 'quasar';
import { defineComponent, ref } from 'vue';
import { channelNameRules } from '../utils/rules';

export default defineComponent({
  setup() {
    const isDialogOpen = ref<boolean>(true);
    const isChannelPublic = ref<boolean>(false);
    const channelNameRef = ref<QInput | null>(null);
    const channelName = ref<string>('');

    const submitting = ref<boolean>(false);

    const onSubmit = () => {
      Promise.all([channelNameRef.value?.validate()])
        .then((result) => {
          if (result.every((v) => v === true)) {
            // TODO: create new channel
            console.log('Creating new channel');
          }
        })
        .catch(console.log);
    };

    return {
      isDialogOpen,
      isChannelPublic,
      channelNameRef,
      channelName,

      channelNameRules,

      submitting,
      onSubmit
    };
  },
});
</script>
