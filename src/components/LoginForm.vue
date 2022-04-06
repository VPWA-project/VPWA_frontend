<template>
  <form @submit.prevent.stop="handleSubmit">
    <h2 class="text-h6 text-center">Login</h2>

    <q-input
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      v-model="state.email"
      borderless
      :error="v$.email.$error"
      label="Email"
    >
      <template v-slot:error>
        <span :key="error.$uid" v-for="error of v$.email.$errors">
          {{ error.$message }}
        </span>
      </template></q-input
    >
    <q-input
      color="cyan-9"
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      borderless
      v-model="state.password"
      :error="v$.password.$error"
      :type="state.isPwd ? 'password' : 'text'"
      label="Password"
    >
      <template v-slot:append>
        <q-icon
          :name="state.isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer q-pr-md"
          @click="state.isPwd = !state.isPwd"
        />
      </template>

      <template v-slot:error>
        <span :key="error.$uid" v-for="error of v$.password.$errors">
          {{ error.$message }}
        </span>
      </template>
    </q-input>

    <div class="row justify-center">
      <q-btn
        type="submit"
        :loading="submitting"
        label="Login"
        class="q-mt-lg q-pa-md border-15"
        style="width: 100%"
        color="cyan-9"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </div>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { useStore } from '../store';
import { helpers, required, email, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router';
import { LoginCredentials } from 'src/contracts/Auth';

const rules = {
  email: {
    required: helpers.withMessage('E-mail is required', required),
    email: helpers.withMessage('Invalid e-mail address', email),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage(
      'Password must be at least 8 characters long',
      minLength(8)
    ),
  },
};

export default defineComponent({
  name: 'LoginForm',

  setup() {
    const $store = useStore();
    const router = useRouter();
    const route = useRoute();

    const state = reactive({
      email: '',
      password: '',
      isPwd: true,
    });

    const v$ = useVuelidate(rules, state);

    const redirectTo = computed(
      () => (route.query.redirect as string) || { name: 'home' }
    ) as RouteLocationRaw;
    const submitting = computed(() => $store.state.auth.status === 'pending');

    const handleSubmit = () => {
      v$.value
        .$validate()
        .then((isValid) => {
          if (isValid) {
            const payload: LoginCredentials = {
              email: state.email,
              password: state.password,
            };

            $store
              .dispatch('auth/login', payload)
              .then(() => router.push(redirectTo))
              .catch(console.log);
          }
        })
        .catch(console.log);
    };

    return {
      state,
      v$,
      submitting,
      handleSubmit,
    };
  },
});
</script>
