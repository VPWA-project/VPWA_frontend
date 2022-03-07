<template>
  <div class="q-pa-md full-width">
    <q-infinite-scroll @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div v-for="(message, index) in items" :key="index">
        <div>
          <q-chat-message
            push
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar1.jpg"
            :text="[message]"
          />
          <q-popup-proxy>
            <div>
              <q-banner class="text-h6"> Meno Priezvisko </q-banner>
              <div class="row">
                <q-badge color="green" rounded />
                <q-banner class="q-pt-none"> Status </q-banner>
              </div>
            </div>
          </q-popup-proxy>
        </div>
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  // props: {
  //   messages: Array
  // },

  setup() {
    const items = ref(['a', 'b', 'c', 'd', 'e', 'f', 'g']);

    return {
      items,

      onLoad(done: () => void) {
        setTimeout(() => {
          items.value.splice(0, 0, 'a', 'b', 'c', 'd', 'e');
          done();
        }, 2000);
      },
    };
  },
});
</script>

<style>
.full-width {
  width: 100%;
}
</style>
