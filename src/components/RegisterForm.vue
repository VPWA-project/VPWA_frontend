<template>
  <form @submit.prevent.stop="handleSubmit">
    <h2 class="text-h6 text-center">Register</h2>

    <q-input
      class="q-mt-lg rounded-borders border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.email"
      :error="v$.email.$error"
      label="Email"
    >
      <template v-slot:error>
        <span :key="error.$uid" v-for="error of v$.email.$errors">
          {{ error.$message }}
        </span>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg rounded-borders border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.password"
      :error="v$.password.$error"
      :type="state.isPwd ? 'password' : 'text'"
      label="Password"
    >
      <template v-slot:append>
        <q-icon
          :name="state.isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="state.isPwd = !state.isPwd"
        />
      </template>
      <template v-slot:error>
        <span :key="error.$uid" v-for="error of v$.password.$errors">
          {{ error.$message }}
        </span>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg rounded-borders border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.firstname"
      :error="v$.firstname.$error"
      label="Firstname"
    >
      <template v-slot:error>
        <span :key="error.$uid" v-for="error of v$.firstname.$errors">
          {{ error.$message }}
        </span>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg rounded-borders border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.lastname"
      :error="v$.lastname.$error"
      label="Lastname"
    >
      <template v-slot:error>
        <span :key="error.$uid" v-for="error of v$.lastname.$errors">
          {{ error.$message }}
        </span>
      </template>
    </q-input>

    <q-input
      class="q-mt-lg rounded-borders border-15 bg-white q-pb-none q-pl-md q-pr-md"
      color="cyan-9"
      borderless
      v-model="state.nickname"
      :error="v$.nickname.$error"
      label="Nickname"
    >
      <template v-slot:error>
        <span :key="error.$uid" v-for="error of v$.nickname.$errors">
          {{ error.$message }}
        </span>
      </template>
    </q-input>

    <div class="row justify-center">
      <q-btn
        type="submit"
        :loading="state.submitting"
        label="Register"
        class="q-mt-lg q-pa-md rounded-borders border-15"
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
import { defineComponent, reactive } from 'vue';
import { useStore } from '../store';
import { helpers, required, email, minLength } from '@vuelidate/validators';
import { UserRegisterPayload } from '../store/user/types';
import { useRouter } from 'vue-router';

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
      firstname: '',
      lastname: '',
      nickname: '',
      isPwd: true,
      submitting: false,
    });

    const $store = useStore();
    const router = useRouter();

    const v$ = useVuelidate(rules, state);

    const handleSubmit = () => {
      state.submitting = true;

      v$.value
        .$validate()
        .then((isValid) => {
          if (isValid) {
            const payload: UserRegisterPayload = {
              email: state.email,
              password: state.password,
              firstname: state.firstname,
              lastname: state.lastname,
              nickname: state.nickname,
            };

            state.submitting = false;
            $store
              .dispatch('user/registerUser', payload)
              .then(() => {
                router.push('/').catch(console.log);
              })
              .catch(console.log);
          } else {
            state.submitting = false;
          }
        })
        .catch(console.log);
    };

    return {
      state,
      v$,
      handleSubmit,
    };
  },
});
</script>
