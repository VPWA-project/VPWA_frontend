import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('pages/Account.vue'),
    meta: {
      guestOnly: true
    }
  },
  {
    path: '/chat/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'chat',
        component: () => import('pages/Chat.vue'),
      },
    ],
    meta: {
      requiresAuth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
