import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Streaming from '../components/Streaming.vue';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  { path: '/streaming', component: Streaming, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard to check if route requires authentication
router.beforeEach((to, from, next) => {
  if (to.query.token) {
    localStorage.setItem('twt', to.query.token);
    // Remove token from URL
    next(to.path)
  }
  if (to.meta.requiresAuth) {
    const jwt = localStorage.getItem('twt');
    if (!jwt) {
      // Redirect to login page if JWT token does not exist
      next('/login');
    } else {
      // Continue to the requested route
      next();
    }
  } else {
    // Continue to the requested route
    next();
  }
});

export default router;
