<template>
  <form @submit.prevent.stop="handleSubmit">
    <h2 class="text-h6 text-center">Register</h2>

    <q-input
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.email"
      :error="v$.email.$error || !!state.serverErrors?.email"
      @keyup="clearServerError(state, 'email')"
      name="email"
      label="Email"
      bottom-slots
    >
      <template v-slot:error>
        <div :key="error.$uid" v-for="error of v$.email.$errors">
          {{ error.$message }}
        </div>
        <div :key="index" v-for="(error, index) of state.serverErrors.email">
          {{ error }}
        </div>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.password"
      :error="v$.password.$error || !!state.serverErrors?.password"
      :type="state.isPwd ? 'password' : 'text'"
      @keyup="clearServerError(state, 'password')"
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
        <div :key="index" v-for="(error, index) of state.serverErrors.password">
          {{ error }}
        </div>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.password_confirmation"
      :error="
        v$.password_confirmation.$error ||
        !!state.serverErrors?.password_confirmation
      "
      :type="state.isPwd ? 'password' : 'text'"
      @keyup="clearServerError(state, 'password_configuration')"
      name="password_confirmation"
      label="Confirm password"
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
        <div
          :key="error.$uid"
          v-for="error of v$.password_confirmation.$errors"
        >
          {{ error.$message }}
        </div>
        <div
          :key="index"
          v-for="(error, index) of state.serverErrors.password_confirmation"
        >
          {{ error }}
        </div>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.firstname"
      :error="v$.firstname.$error || !!state.serverErrors?.firstname"
      @keyup="clearServerError(state, 'firstname')"
      name="firstname"
      label="Firstname"
      bottom-slots
    >
      <template v-slot:error>
        <div :key="error.$uid" v-for="error of v$.firstname.$errors">
          {{ error.$message }}
        </div>
        <div
          :key="index"
          v-for="(error, index) of state.serverErrors.firstname"
        >
          {{ error }}
        </div>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.lastname"
      :error="v$.lastname.$error || !!state.serverErrors?.lastname"
      @keyup="clearServerError(state, 'lastname')"
      name="lastname"
      label="Lastname"
      bottom-slots
    >
      <template v-slot:error>
        <div :key="error.$uid" v-for="error of v$.lastname.$errors">
          {{ error.$message }}
        </div>
        <div :key="index" v-for="(error, index) of state.serverErrors.lastname">
          {{ error }}
        </div>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.nickname"
      :error="v$.nickname.$error || !!state.serverErrors?.nickname"
      @keyup="clearServerError(state, 'nickname')"
      name="nickname"
      label="Nickname"
      bottom-slots
    >
      <template v-slot:error>
        <div :key="error.$uid" v-for="error of v$.nickname.$errors">
          {{ error.$message }}
        </div>
        <div :key="index" v-for="(error, index) of state.serverErrors.nickname">
          {{ error }}
        </div>
      </template>
    </q-input>

    <div class="row justify-center">
      <q-btn
        type="submit"
        :loading="submitting"
        label="Register"
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
import useVuelidate from '@vuelidate/core';
import { defineComponent, reactive, computed } from 'vue';
import { useStore } from '../store';
import { helpers, required, email, minLength } from '@vuelidate/validators';
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router';
import { RegisterRequest, ServerErrors } from 'src/contracts';
import { groupValidationErrors, clearServerError } from 'src/utils/utils';

const isFirstLetterUppercase = (value: string) => {
  return value.charAt(0).toUpperCase() === value.charAt(0);
};

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
  password_confirmation: {
    required: helpers.withMessage('Password must be confirmed', required),
  },
  firstname: {
    required: helpers.withMessage('Firstname is required', required),
    isFirstLetterUppercase: helpers.withMessage(
      'The first letter of firstname must be uppercase',
      isFirstLetterUppercase
    ),
  },
  lastname: {
    required: helpers.withMessage('Lastname is required', required),
    isFirstLetterUppercase: helpers.withMessage(
      'The first letter of lastname must be uppercase',
      isFirstLetterUppercase
    ),
  },
  nickname: {
    required: helpers.withMessage('Nickname is required', required),
    minLength: helpers.withMessage(
      'Nickname must have at least 3 characters',
      minLength(3)
    ),
  },
};

export default defineComponent({
  name: 'RegisterForm',

  setup() {
    const state = reactive({
      email: '',
      password: '',
      password_confirmation: '',
      firstname: '',
      lastname: '',
      nickname: '',
      isPwd: true,
      serverErrors: {} as ServerErrors,
    });

    const $store = useStore();
    const router = useRouter();
    const route = useRoute()

    const v$ = useVuelidate(rules, state);

    const submitting = computed(() => $store.state.auth.status === 'pending');
    const redirectTo = computed(
      () => (route.query.redirect as string) || { name: 'home' } as RouteLocationRaw
    );

    const handleSubmit = () => {
      v$.value
        .$validate()
        .then((isValid) => {
          if (isValid) {
            const payload: RegisterRequest = {
              email: state.email,
              password: state.password,
              password_confirmation: state.password_confirmation,
              firstname: state.firstname,
              lastname: state.lastname,
              nickname: state.nickname,
            };

            $store
              .dispatch('auth/register', payload)
              .then(() => router.push(redirectTo.value))
              .catch(() => {
                state.serverErrors = groupValidationErrors(
                  $store.state.auth.errors
                );
              });
          }
        })
        .catch(console.log);
    };

    return {
      state,
      submitting,
      v$,
      clearServerError,
      handleSubmit,
    };
  },
});
</script>
