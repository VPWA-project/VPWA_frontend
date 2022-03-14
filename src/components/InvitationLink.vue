<template>
  <q-item clickable>
    <q-item-section v-if="type" avatar>
      <q-icon :name="getIconByType(type)" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
    </q-item-section>

    <q-item-section>
      <slot name="append"> </slot>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { ChannelType } from 'src/store/channels/state';
import { defineComponent, computed } from 'vue';

const getIconByType = (type: ChannelType): string => {
  if (type === ChannelType.Private) {
    return 'lock';
  }

  return 'tag';
};

export default defineComponent({
  name: 'InvitationLink',
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      getIconByType: computed(() => {
        return (type: ChannelType) => getIconByType(type);
      }),
    };
  },
});
</script>
