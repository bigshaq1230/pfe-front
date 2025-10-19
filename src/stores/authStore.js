import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role);

  const hasRole = (role) => user.value?.role === role;
  const hasAnyRole = (roles) => roles.includes(user.value?.role);

  const login = async (email, password) => {
    loading.value = true;
    try {
      const response = await api.post('/auth/login', { email, password });

      user.value = response.data.data.user;
      token.value = response.data.data.token;

      localStorage.setItem('token', token.value);
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const fetchProfile = async () => {
    if (!token.value) return;

    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      const response = await api.get('/auth/profile');
      user.value = response.data.data;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const initializeAuth = async () => {
    if (token.value) {
      await fetchProfile();
    }
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userRole,
    hasRole,
    hasAnyRole,
    login,
    logout,
    fetchProfile,
    initializeAuth
  };
});