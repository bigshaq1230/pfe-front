<template>
  <div class="auth-container">
    <div class="auth-card card">
      <div class="auth-header">
        <h1>Inscription</h1>
        <p>Créez votre compte Smart Waste</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="nom">Nom complet</label>
          <input
            type="text"
            id="nom"
            v-model="userData.nom"
            required
            placeholder="Votre nom complet"
          >
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="userData.email"
            required
            placeholder="votre@email.com"
          >
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="userData.password"
            required
            placeholder="Minimum 6 caractères"
            minlength="6"
          >
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="userData.confirmPassword"
            required
            placeholder="Confirmez votre mot de passe"
          >
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="authStore.loading || !passwordsMatch"
        >
          <span v-if="authStore.loading">Inscription...</span>
          <span v-else>S'inscrire</span>
        </button>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <div v-if="!passwordsMatch && userData.confirmPassword" class="error-message">
          Les mots de passe ne correspondent pas
        </div>
      </form>

      <div class="auth-footer">
        <p>
          Déjà un compte ?
          <router-link to="/login" class="auth-link">Se connecter</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Register',
  setup() {
    const userData = ref({
      nom: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const authStore = useAuthStore()
    const router = useRouter()

    const passwordsMatch = computed(() =>
      userData.value.password === userData.value.confirmPassword
    )

    const handleRegister = async () => {
      if (!passwordsMatch.value) return

      const { confirmPassword, ...registerData } = userData.value
      const result = await authStore.register(registerData)

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
      userData,
      authStore,
      passwordsMatch,
      handleRegister
    }
  }
}
</script>

<style scoped>
/* Les styles sont les mêmes que Login.vue */
</style>