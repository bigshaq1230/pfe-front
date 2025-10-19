<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 class="login-title">Gestion Intelligente des Déchets</h1>
        <p class="login-subtitle">Système municipal de gestion des déchets urbains</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Adresse Email</label>
          <input
            id="email"
            v-model="loginData.email"
            type="email"
            class="form-input"
            placeholder="votre@email.com"
            required
            :disabled="authStore.loading"
          >
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Mot de Passe</label>
          <input
            id="password"
            v-model="loginData.password"
            type="password"
            class="form-input"
            placeholder="Votre mot de passe"
            required
            :disabled="authStore.loading"
          >
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-btn"
          :disabled="authStore.loading || !isFormValid"
          :class="{ 'loading': authStore.loading }"
        >
          <span v-if="!authStore.loading">Se Connecter</span>
          <span v-else class="loading-text">Connexion...</span>
        </button>
      </form>


    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';


const router = useRouter();
const authStore = useAuthStore();

const loginData = reactive({
  email: '',
  password: ''
});

const errorMessage = ref('');

const isFormValid = computed(() => {
  return loginData.email && loginData.password;
});

const handleLogin = async () => {
  errorMessage.value = '';

  try {
    await authStore.login(loginData.email, loginData.password);

    // Redirect based on user role
    const redirectPath = getRedirectPath(authStore.user.role);
    await router.push(redirectPath);

  } catch (error) {
    errorMessage.value = error.message || 'Erreur de connexion. Veuillez réessayer.';
  }
};

const getRedirectPath = (role) => {
  const routes = {
    admin: '/dashboard',
    gestionnaire: '/dashboard',
    agent: '/tournees',
    responsable_environnement: '/dashboard'
  };
  return routes[role] || '/dashboard';
};

</script>
