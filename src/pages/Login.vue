<script setup lang="ts">
import TabLayout from 'src/layouts/TabLayout.vue';
import LoginForm from 'src/components/LoginForm.vue';
import RegisterForm from 'src/components/RegisterForm.vue';
</script>

<template>
    <TabLayout defaultTab="login">
        <template v-slot:tabs>
            <q-tab name="login" label="Login" />
            <q-tab name="register" label="Register" />
        </template>

        <template>
            <LoginForm />
            <RegisterForm />
        </template>
    </TabLayout>
</template>