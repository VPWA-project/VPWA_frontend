<template>
  <q-tab-panel name="login">
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
  </q-tab-panel>
</template>

<script lang="ts">
import { QInput } from 'quasar';
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginForm',

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

    const startWithUpperCase = (str: string) => {
      return str.length > 0 && str.charAt(0) === str.charAt(0).toUpperCase();
    };

    const emailRules = [
      // https://www.w3resource.com/javascript/form/email-validation.php
      (val: string) => !!val || 'Email is required',
      (val: string) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
        'Email is invalid',
    ];

    const firstnameRules = [
      (val: string) => !!val || 'Firstname is required',
      (val: string) =>
        startWithUpperCase(val) || 'Firstname must start with uppercase',
    ];

    const lastnameRules = [
      (val: string) =>
        (!!val && startWithUpperCase(val)) ||
        'Lastname must start with uppercase',
    ];
    const nicknameRules = [(val: string) => !!val || 'Nickname is required'];

    const passwordRules = [
      (val: string) =>
        (!!val && val.length >= 8) ||
        'Password must be at least 8 characters long',
    ];

    const onSubmit = async () => {
      await emailRef.value?.validate();
      await firstnameRef.value?.validate();
      await lastnameRef.value?.validate();
      await nicknameRef.value?.validate();
      await passwordRef.value?.validate();
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
