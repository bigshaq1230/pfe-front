<template>
  <div id="app">
    <nav class="navbar" v-if="authStore.isAuthenticated">
      <div class="nav-container">
        <h1 class="nav-logo">♻️ Smart Waste</h1>
        <div class="nav-links">
          <router-link to="/">Tableau de bord</router-link>
          <router-link to="/points-collecte">Points de Collecte</router-link>
          <router-link to="/vehicules">Véhicules</router-link>
          <router-link to="/employes">Employés</router-link>
          <router-link to="/tournees">Tournées</router-link>
        </div>
        <div class="nav-user">
          <span class="user-info">Bonjour, {{ authStore.userInfo.nom }}</span>
          <button @click="handleLogout" class="btn-logout">Déconnexionn</button>
        </div>
      </div>
    </nav>

    <main class="main-content" :class="{ 'auth-page': !authStore.isAuthenticated }">
      <router-view />
    </main>

    <footer class="footer" v-if="authStore.isAuthenticated">
      <p>&copy; 2024 Système Intelligent de Gestion des Déchets Urbains</p>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()

    const handleLogout = () => {
      authStore.logout()
    }

    return {
      authStore,
      handleLogout
    }
  }
}
</script>

<style scoped>
.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  color: white;
  font-weight: 500;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.auth-page {
  padding: 0;
  min-height: 100vh;
}
</style>