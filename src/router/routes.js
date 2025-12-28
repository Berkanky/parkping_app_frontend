const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', name:'login', component: () => import('pages/LoginPage.vue'), meta: { requires_auth: false }  },
      { path: 'home', name:'home', component: () => import('pages/IndexPage.vue'), meta: { requires_auth: true }  },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
