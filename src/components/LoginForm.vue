<template>
  <form @submit.prevent.stop="onSubmit">
    <h2 class="text-h6 text-center">Login</h2>

    <q-input
      class="q-mt-lg"
      outlined
      ref="emailRef"
      v-model="email"
      label="Email"
      :rules="emailRules"
    />
    <q-input
      class="q-mt-md"
      outlined
      ref="passwordRef"
      v-model="password"
      :type="isPwd ? 'password' : 'text'"
      label="Password"
      :rules="passwordRules"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <div class="row justify-center">
      <q-btn
        type="submit"
        :loading="submitting"
        label="Register"
        class="q-mt-md q-pa-md"
        style="width: 100%"
        color="blue"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </div>
  </form>
</template>

<script lang="ts">
import { QInput } from "quasar";
import { ref, defineComponent } from "vue";
import { emailRules, passwordRules } from "src/utils/rules";

export default defineComponent({
  name: 'LoginForm',
  
  setup() {
    const email = ref<string | null>(null)
    const emailRef = ref<QInput | null>(null)

    const password = ref<string | null>(null)
    const passwordRef = ref<QInput | null>(null)
    const isPwd = ref<boolean>(true)

    const submitting = ref<boolean>(false)

    const onSubmit = async () => {
      await emailRef.value?.validate()
      await passwordRef.value?.validate()
    }

    return {
      email,
      emailRef,
      password,
      passwordRef,
      isPwd,
      submitting,
      emailRules,
      passwordRules,
      onSubmit
    }
  }
})

</script>