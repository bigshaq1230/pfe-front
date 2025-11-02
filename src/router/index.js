import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/dashboard.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/vehicules',
    name: 'Vehicules',
    component: () => import('../views/vehicules.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/employes',
    name: 'Employes',
    component: () => import('../views/employes.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/register.vue'),
    meta: { requiresGuest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Garde de navigation
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Vérifier l'authentification si nécessaire
  if (!authStore.user && authStore.token) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router