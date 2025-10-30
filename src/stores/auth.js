import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref(null)

  const router = useRouter()

  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userInfo = computed(() => user.value)

  // Configuration d'axios pour inclure le token
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, credentials)

      if (response.data.success) {
        const { user: userData, token: tokenData } = response.data.data

        user.value = userData
        token.value = tokenData

        // Stocker le token dans le localStorage
        localStorage.setItem('token', tokenData)
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`

        return { success: true }
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Erreur de connexion'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(`${API_BASE}/auth/register`, userData)

      if (response.data.success) {
        const { user: newUser, token: tokenData } = response.data.data

        user.value = newUser
        token.value = tokenData

        // Stocker le token dans le localStorage
        localStorage.setItem('token', tokenData)
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`

        return { success: true }
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Erreur d\'inscription'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null

    // Supprimer le token du localStorage
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']

    // Rediriger vers la page de login
    router.push('/login')
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      const response = await axios.get(`${API_BASE}/auth/profile`)
      if (response.data.success) {
        user.value = response.data.data.user
        return true
      }
    } catch (err) {
      // Token invalide, déconnecter l'utilisateur
      logout()
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    userInfo,

    // Actions
    login,
    register,
    logout,
    checkAuth,
    clearError
  }
})