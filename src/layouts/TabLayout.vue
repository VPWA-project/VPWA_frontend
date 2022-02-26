<template>
    <div
    class="q-pa-md full-width row justify-center items-center content-center"
  >
    <q-card style="width: 480px">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <slot name="tabs"></slot>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <slot></slot>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, defineComponent } from 'vue';

export default defineComponent({
    name: 'TabLayout',
    props: {
        defaultTab: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const { defaultTab } = toRefs(props)

        return {
            tab: ref(defaultTab.value)
        }
    }
})

</script>