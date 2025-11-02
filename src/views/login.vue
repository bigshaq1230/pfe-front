<template>
  <div class="auth-container">
    <div class="auth-card card">
      <div class="auth-header">
        <h1>Connexion</h1>
        <p>Accédez à votre compte Smart Waste</p>
      </div>
      <p>email: admin@smartwaste.com</p>
      <p>pass: 123</p>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="credentials.email" required placeholder="votre@email.com">
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="credentials.password" required placeholder="Votre mot de passe">
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="authStore.loading">
          <span v-if="authStore.loading">Connexion...</span>
          <span v-else>Se connecter</span>
        </button>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>
      </form>

      <div class="auth-footer">
        <p>
          Pas de compte ?
          <router-link to="/register" class="auth-link">S'inscrire</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'


const credentials = ref({
  email: '',
  password: ''
})

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  const result = await authStore.login(credentials.value)
  if (result.success) {
    router.push('/')
  }
}

onMounted(() => {
  // Rediriger si déjà connecté
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

</script>
