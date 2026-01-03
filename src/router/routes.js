const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/welcome' },
      { path: 'login', name:'login', component: () => import('pages/LoginPage.vue'), meta: { requires_auth: false }  },
      { path: 'home', name:'home', component: () => import('pages/IndexPage.vue'), meta: { requires_auth: true }  },
      { path:'welcome', name:'welcome', component:() => import('pages/splash_screen.vue'),  meta: { requires_auth: false } },
      { path:'vehicle-profile/:vehicle_id', name:'vehicle-profile', props: true, component:() => import('pages/VehicleProfile.vue'),  meta: { requires_auth: true } },
      { path:'add-vehicle/:user_id', name:'add-vehicle', props: true, component:() => import('pages/AddVehiclePage.vue'),  meta: { requires_auth: true } },
      { path:'access-details/:user_id', name:'access-details', props: true, component:() => import('pages/AccessDetails.vue'),  meta: { requires_auth: true } },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
