const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/welcome' },
      { path: 'login', name:'login', component: () => import('pages/LoginPage.vue'), meta: { requires_auth: false, is_avaliable_for_temporary_users: true } },
      { path: 'home', name:'home', component: () => import('pages/IndexPage.vue'), meta: { requires_auth: true, is_avaliable_for_temporary_users: true  } },
      { path:'welcome', name:'welcome', component:() => import('pages/splash_screen.vue'),  meta: { requires_auth: false, is_avaliable_for_temporary_users: true  } },
      { path:'vehicle-profile/:vehicle_id', name:'vehicle-profile', props: true, component:() => import('pages/VehicleProfile.vue'),  meta: { requires_auth: true, is_avaliable_for_temporary_users: true  } },
      { path:'add-vehicle/:user_id', name:'add-vehicle', props: true, component:() => import('pages/AddVehiclePage.vue'),  meta: { requires_auth: true, is_avaliable_for_temporary_users: false } },
      { path:'access-details/:user_id', name:'access-details', props: true, component:() => import('pages/AccessDetails.vue'),  meta: { requires_auth: true, is_avaliable_for_temporary_users: false } },
      { path: 'search-vehicle-plate', name:'search-vehicle-plate', component: () => import('pages/SearchVehiclePlate.vue'), meta: { requires_auth: true, is_avaliable_for_temporary_users: true  } },
      { path: 'verify-access-token', name:'verify-access-token', component: () => import('src/pages/VerifyAccessToken.vue'), meta: { requires_auth: true, is_avaliable_for_temporary_users: true  } },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
