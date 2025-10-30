<template>
  <div class="auth-container">
    <div class="auth-card card">
      <div class="auth-header">
        <h1>Connexion</h1>
        <p>Accédez à votre compte Smart Waste</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            id="email"
            v-model="credentials.email"
            required
            placeholder="votre@email.com"
          >
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="credentials.password"
            required
            placeholder="Votre mot de passe"
          >
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="authStore.loading"
        >
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

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
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

    return {
      credentials,
      authStore,
      handleLogin
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  color: #2e7d32;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #666;
}

.auth-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4caf50;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
}

.auth-footer {
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.auth-link {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>