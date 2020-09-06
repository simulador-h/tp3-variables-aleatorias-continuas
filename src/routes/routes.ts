import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: (): any => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: (): any => import('pages/Index.vue') },
      { path: '/goodness-of-fit', component: (): any => import('pages/GoodnessOfFit.vue') },
      { path: '/random-variables', component: (): any => import('pages/RandomVariables.vue') },
    ],
  },

  // Always leave last
  {
    path: '*',
    component: (): any => import('pages/Error404.vue'),
  },
];

export default routes;
