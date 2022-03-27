<template>
  <q-page class="row items-center justify-evenly">
    <InfiniteScroll />
  </q-page>
</template>

<script lang="ts">
import InfiniteScroll from 'src/components/InfiniteScroll.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: { InfiniteScroll },

  setup() {
    return {};
  },
});
</script>
