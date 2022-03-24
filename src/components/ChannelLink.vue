<template>
  <div class="q-ma-sm bg-white border-15">
    <q-item clickable :href="'#/chat/' + id" class="border-15">
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
  </div>
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
      type: Number,
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
.border-15 {
  border-radius: 15px;
}
</style>
