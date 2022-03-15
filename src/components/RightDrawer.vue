<template>
  <q-list>
    <q-item>
      <q-item-section>
        <q-item-label class="text-grey-7">Online</q-item-label>
      </q-item-section>
    </q-item>

    <UserBanner
      firstname="Frido"
      lastname="Herak"
      nickname="cigan123"
      status="ONLINE"
    />

    <q-item>
      <q-item-section>
        <q-item-label class="text-grey-7">Offline</q-item-label>
      </q-item-section>
    </q-item>

    <UserBanner
      firstname="Frido"
      lastname="Herak"
      nickname="cigan123"
      status="OFFLINE"
    />
  </q-list>
</template>

<script lang="ts">
import UserBanner from './UserBanner.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    UserBanner,
  },
  setup() {
    return {};
  },
});
</script>
