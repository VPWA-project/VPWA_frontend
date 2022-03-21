<template>
  <q-card class="q-ma-sm border">
    <q-item clickable :href="'#/chat/' + id" class="border">
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
  </q-card>
</template>

<script lang="ts">
import { ChannelType } from 'src/store/channels/state';
import { defineComponent, computed, PropType } from 'vue';

const getIconByType = (type: ChannelType): string => {
  if (type === ChannelType.Private) {
    return 'lock';
  }

  return 'tag';
};

export default defineComponent({
  name: 'ChannelLink',
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<ChannelType>,
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

<style scoped>
.border {
  border-radius: 15px;
}
</style>
