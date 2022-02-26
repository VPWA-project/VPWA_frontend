<template>
  <div
    class="q-pa-md full-width row justify-center items-center content-center"
  >
    <q-card style="width: 480px">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <form @submit.prevent.stop="onLoginSubmit">
            <h2 class="text-h6 text-center">Login</h2>

            <q-input
              class="q-mt-lg"
              outlined
              ref="emailLoginRef"
              v-model="emailLogin"
              label="Email"
              :rules="emailRules"
            />
            <q-input
              class="q-mt-md"
              outlined
              ref="passwordLoginRef"
              v-model="passwordLogin"
              :type="isPwdLogin ? 'password' : 'text'"
              label="Password"
              :rules="passwordRules"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdLogin ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdLogin = !isPwdLogin"
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

        <q-tab-panel name="register">
          <form @submit.prevent.stop="onRegisterSubmit">
            <h2 class="text-h6 text-center">Register</h2>

            <q-input
              class="q-mt-lg"
              outlined
              ref="emailRegisterRef"
              v-model="emailRegister"
              label="Email"
              :rules="emailRules"
            />
            <q-input
              class="q-mt-md"
              outlined
              ref="passwordRegisterRef"
              v-model="passwordRegister"
              :type="isPwdRegister ? 'password' : 'text'"
              label="Password"
              :rules="passwordRules"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdRegister ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdRegister = !isPwdRegister"
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
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script lang="ts">
import { QInput } from 'quasar';
import { ref, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const emailLogin = ref<string | null>(null);
    const emailLoginRef = ref<QInput | null>(null);

    const emailRegister = ref<string | null>(null);
    const emailRegisterRef = ref<QInput | null>(null);

    const firstname = ref<string | null>(null);
    const firstnameRef = ref<QInput | null>(null);

    const lastname = ref<string | null>(null);
    const lastnameRef = ref<QInput | null>(null);

    const nickname = ref<string | null>(null);
    const nicknameRef = ref<QInput | null>(null);

    const passwordLogin = ref<string | null>(null);
    const passwordLoginRef = ref<QInput | null>(null);

    const passwordRegister = ref<string | null>(null);
    const passwordRegisterRef = ref<QInput | null>(null);

    const isPwdLogin = ref<boolean>(true);
    const isPwdRegister = ref<boolean>(true);
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

    const onLoginSubmit = async () => {
      await emailLoginRef.value?.validate();
      await firstnameRef.value?.validate();
      await lastnameRef.value?.validate();
      await nicknameRef.value?.validate();
      await passwordLoginRef.value?.validate();
    };

    const onRegisterSubmit = async () => {
      await emailRegisterRef.value?.validate();
      await passwordRegisterRef.value?.validate();
    };

    return {
      emailLogin,
      emailLoginRef,
      emailRegister,
      emailRegisterRef,
      firstname,
      firstnameRef,
      lastname,
      lastnameRef,
      nickname,
      nicknameRef,
      passwordLogin,
      passwordLoginRef,
      passwordRegister,
      passwordRegisterRef,
      isPwdLogin,
      isPwdRegister,
      submitting,
      tab: ref('login'),
      emailRules,
      passwordRules,
      firstnameRules,
      lastnameRules,
      nicknameRules,
      onLoginSubmit,
      onRegisterSubmit,
    };
  },
});
</script>
