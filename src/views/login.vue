<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="logo">

        </div>
        <h1 class="login-title">Gestion Intelligente des Déchets</h1>
        <p class="login-subtitle">Système municipal de gestion des déchets urbains</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Adresse Email </label>
          <input
            id="email"
            v-model="loginData.email"
            type="email"
            class="form-input"
            placeholder="votre@email.com"
            required
            :disabled="authStore.loading"
           />
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
            :disabled="authStore.loading"> </input>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <n-button
        type="primary"
        attr-type="submit"
        :disabled ="authStore.loading || !isFormValid"
          :class="{ 'loading': authStore.loading }"
        >
          <span v-if="!authStore.loading">Se Connecter</span>
          <span v-else class="loading-text">Connexion...</span>
        </n-button>
      </form>


    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { defineComponent } from 'vue'
import { NButton,NInput } from 'naive-ui'

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
