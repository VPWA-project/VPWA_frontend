<template>
    <UserBanner
      :firstname="firstname"
      :lastname="lastname"
      :nickname="nickname"
      :status="status"
    >
      <template v-slot:append>
        <q-item-section avatar>
          <q-btn flat class="no-border" icon="more_vert">
            <q-menu fit>
              <q-list style="width: 150px">
                <q-item clickable>
                  <q-item-section>Kick</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Ban</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
      </template>
    </UserBanner>
</template>

<script lang="ts">
import UserBanner from './UserBanner.vue'

import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    components: {
        UserBanner
    },
    setup() {
        return {

        }
    },
})
</script>
