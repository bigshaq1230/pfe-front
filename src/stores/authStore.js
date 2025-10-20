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
    // Clear state
    user.value = null;
    token.value = null;

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Clear auth header
    delete api.defaults.headers.common['Authorization'];
  };

  const fetchProfile = async () => {
    if (!token.value) {
      logout();
      return;
    }

    try {
      // Ensure auth header is set
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

      const response = await api.get('/auth/profile');
      user.value = response.data.data;

      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(user.value));
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
      throw error;
    }
  };

  // Initialize auth state from localStorage
  const initializeAuth = async () => {
    if (token.value) {
      // Set auth header for API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

      // Verify token is still valid by fetching profile
      try {
        await fetchProfile();
        console.log('✅ Authentication restored from localStorage');
      } catch (error) {
        console.error('❌ Token invalid, logging out:', error);
        logout();
      }
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