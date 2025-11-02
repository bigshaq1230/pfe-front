<template>
  <div id="app">
    <nav class="navbar" v-if="authStore.isAuthenticated">
      <div class="nav-container">
        <h1 class="nav-logo">♻️ Smart Waste</h1>
        <div class="nav-links">
          <ul>
            <li><router-link to="/">Tableau de bord</router-link></li>
            <li><router-link to="/vehicules">Véhicules</router-link></li>
            <li><router-link to="/employes">Employés</router-link></li>
          </ul>
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

<script setup>
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>
