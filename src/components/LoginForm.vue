<template>
  <form @submit.prevent.stop="handleSubmit">
    <h2 class="text-h6 text-center">Login</h2>

    <q-banner v-if="serverError" inline-actions class="text-white bg-red">
      {{ serverError.message }}
    </q-banner>

    <q-input
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.email"
      :error="v$.email.$error || !!state.serverValidationErrors?.email"
      @keyup="clearServerError(state.serverValidationErrors, 'email')"
      name="email"
      label="Email"
      bottom-slots
    >
      <template v-slot:error>
        <div :key="error.$uid" v-for="error of v$.email.$errors">
          {{ error.$message }}
        </div>
        <div
          :key="index"
          v-for="(error, index) of state.serverValidationErrors.email"
        >
          {{ error }}
        </div>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.password"
      :error="v$.password.$error || !!state.serverValidationErrors?.password"
      :type="state.isPwd ? 'password' : 'text'"
      @keyup="clearServerError(state.serverValidationErrors, 'password')"
      name="password"
      label="Password"
      bottom-slots
    >
      <template v-slot:append>
        <q-icon
          :name="state.isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="state.isPwd = !state.isPwd"
        />
      </template>
      <template v-slot:error>
        <div :key="error.$uid" v-for="error of v$.password.$errors">
          {{ error.$message }}
        </div>
        <div
          :key="index"
          v-for="(error, index) of state.serverValidationErrors.password"
        >
          {{ error }}
        </div>
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
import {
  LoginRequest,
  ServerError,
  ServerErrors,
  ValidationError,
} from 'src/contracts';
import { groupValidationErrors, clearServerError } from 'src/utils/utils';

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
      serverValidationErrors: {} as ServerErrors,
    });

    const v$ = useVuelidate(rules, state);

    const redirectTo = computed(
      () =>
        (route.query.redirect as string) ||
        ({ name: 'home' } as RouteLocationRaw)
    );
    const submitting = computed(() => $store.state.auth.status === 'pending');

    const validationErrors = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => $store.getters['auth/getValidationErrors'] as ValidationError[]
    );

    const handleSubmit = () => {
      v$.value
        .$validate()
        .then((isValid) => {
          if (isValid) {
            const payload: LoginRequest = {
              email: state.email,
              password: state.password,
            };

            $store
              .dispatch('auth/login', payload)
              .then(() => router.push(redirectTo.value))
              .catch(() => {
                state.serverValidationErrors = groupValidationErrors(
                  validationErrors.value
                );
              });
          }
        })
        .catch(console.log);
    };

    return {
      state,
      v$,
      submitting,
      clearServerError,
      handleSubmit,
      serverError: computed(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        () => $store.getters['auth/getServerError'] as ServerError | null
      ),
    };
  },
});
</script>
