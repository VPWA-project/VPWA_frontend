<script setup lang="ts">
import TabLayout from 'src/layouts/TabLayout.vue';
import RegisterForm from 'src/components/RegisterForm.vue';
import LoginForm from 'src/components/LoginForm.vue';
</script>

<template>
  <TabLayout defaultTab="login">
    <template v-slot:tabs>
      <q-tab name="login" label="Login" />
      <q-tab name="register" label="Register" />
    </template>

    <template v-slot>
      <q-tab-panel name="login">
        <LoginForm />
      </q-tab-panel>
      <q-tab-panel name="register">
        <RegisterForm />
      </q-tab-panel>
    </template>
  </TabLayout>
</template>
