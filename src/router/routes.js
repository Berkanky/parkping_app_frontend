const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', name: 'home', component: () => import('pages/IndexPage.vue') },
      { path: '/login', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: '/vehicle-profile', name:'vehicle-profile', component: () => import('pages/VehicleProfile.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
