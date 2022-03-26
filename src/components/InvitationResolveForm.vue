<template>
  <div class="bg-cyan-9 text-black q-pa-sm q-mx-sm border-all-15">
    <div class="text-center text-white" style="font-size: 24px">
      {{ name }}
    </div>
    <div class="column items-center q-py-sm">
      <q-btn
        flat
        label="Join channel"
        class="bg-white border-all-15"
        color="black"
        @click="joinChannel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: Number,
    name: String,
  },
  setup() {
    const joinChannel = () => {
      // TODO: join channel
    };

    return {
      joinChannel,
    };
  },
});
</script>
