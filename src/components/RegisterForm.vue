<template>
  <form @submit.prevent.stop="onSubmit">
    <h2 class="text-h6 text-center">Register</h2>

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
    <q-input
      class="q-mt-md"
      outlined
      ref="firstnameRef"
      v-model="firstname"
      label="Firstname"
      :rules="firstnameRules"
    />
    <q-input
      class="q-mt-md"
      outlined
      ref="lastnameRef"
      v-model="lastname"
      label="Lastname"
      :rules="lastnameRules"
    />
    <q-input
      class="q-mt-md"
      outlined
      ref="nicknameRef"
      v-model="nickname"
      label="Nickname"
      :rules="nicknameRules"
    />

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
import { QInput } from 'quasar';
import { ref, defineComponent } from 'vue';
import {
  emailRules,
  passwordRules,
  firstnameRules,
  lastnameRules,
  nicknameRules,
} from 'src/utils/rules';
import { useStore } from '../store';
import { UserRegisterPayload } from '../store/user/types';

export default defineComponent({
  name: 'RegisterForm',

  setup() {
    const email = ref<string | null>(null);
    const emailRef = ref<QInput | null>(null);

    const password = ref<string | null>(null);
    const passwordRef = ref<QInput | null>(null);
    const isPwd = ref<boolean>(true);

    const firstname = ref<string | null>(null);
    const firstnameRef = ref<QInput | null>(null);

    const lastname = ref<string | null>(null);
    const lastnameRef = ref<QInput | null>(null);

    const nickname = ref<string | null>(null);
    const nicknameRef = ref<QInput | null>(null);

    const submitting = ref<boolean>(false);

    const $store = useStore();

    const onSubmit = () => {
      Promise.all([
        emailRef.value?.validate(),
        firstnameRef.value?.validate(),
        lastnameRef.value?.validate(),
        nicknameRef.value?.validate(),
        passwordRef.value?.validate(),
      ])
        .then((result) => {
          if (result.every((v) => v === true)) {
            const payload: UserRegisterPayload = {
              email: email.value as string,
              password: password.value as string,
              firstname: firstname.value as string,
              lastname: lastname.value as string,
              nickname: nickname.value as string,
            };

            $store.dispatch('user/registerUser', payload).catch(console.log);
            console.log('Register');
          }
        })
        .catch(console.log);
    };

    return {
      email,
      emailRef,
      password,
      passwordRef,
      isPwd,
      firstname,
      firstnameRef,
      lastname,
      lastnameRef,
      nickname,
      nicknameRef,
      submitting,
      emailRules,
      passwordRules,
      firstnameRules,
      lastnameRules,
      nicknameRules,
      onSubmit,
    };
  },
});
</script>
