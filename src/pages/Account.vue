<script setup lang="ts">
import TabLayout from 'src/layouts/TabLayout.vue';
import RegisterForm from 'src/components/RegisterForm.vue';
import LoginForm from 'src/components/LoginForm.vue';
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page class="row items-center justify-evenly">
      <h1
        class="text-center text-weight-medium shadow-blur"
        :class="{ 'text-h4': $q.screen.xs, 'text-h3': $q.screen.gt.xs }"
      >
        Welcome to our chat app
      </h1>

      <TabLayout defaultTab="login">
        <template v-slot:tabs>
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </template>

        <template v-slot>
          <q-tab-panel class="bg-grey-2" name="login">
            <LoginForm />
          </q-tab-panel>
          <q-tab-panel class="bg-grey-2" name="register">
            <RegisterForm />
          </q-tab-panel>
        </template>
      </TabLayout>
    </q-page>
  </q-layout>
</template>

<style scoped>
.shadow-blur {
  text-shadow: 0px 0px 15px rgba(150, 150, 150, 0.54);
}
</style>
