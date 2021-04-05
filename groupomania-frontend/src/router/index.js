import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/profile',
    name: 'Profil',
    // lazy-loaded
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/wall',
    name: 'Wall',
    component: () => import('../views/Wall.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  /*{
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  },*/
  {
    path: '/unsubscribeconfirmation',
    name: 'unsubscribeConfirmation',
    component: () => import('../views/UnsubscribeConfirmation.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/*router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/signup', '/home'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});*/

export default router
