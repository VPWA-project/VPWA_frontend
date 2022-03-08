<template>
  <form @submit.prevent.stop="handleSubmit">
    <h2 class="text-h6 text-center">Login</h2>

    <q-input
      class="q-mt-lg"
      outlined
      v-model="state.email"
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
      class="q-mt-md"
      outlined
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

    <div class="row justify-center">
      <q-btn
        type="submit"
        :loading="state.submitting"
        label="Login"
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
import { defineComponent, reactive } from 'vue';
import { useStore } from '../store';
import { UserStatePayload } from '../store/user/types';
import { helpers, required, email, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

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

    const state = reactive({
      email: '',
      password: '',
      isPwd: true,
      submitting: false,
    });

    const v$ = useVuelidate(rules, state);

    const handleSubmit = () => {
      state.submitting = true;

      v$.value
        .$validate()
        .then((isValid) => {
          if (isValid) {
            const payload: UserStatePayload = {
              email: state.email,
              password: state.password,
            };

            $store
              .dispatch('user/loginUser', payload)
              .then(() => {
                state.submitting = false;

                $store
                  .dispatch('channels/fetchUserChannels', 1)
                  .catch(console.log);
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
