<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Tableau de Bord</h1>
      <p class="welcome-message">Bienvenue, {{ authStore.userInfo.nom }} 👋</p>
    </div>

    <!-- Le reste du code Dashboard reste inchangé -->
    <div class="stats-grid grid grid-3">
      <div class="stat-card card">
        <h3>Points de Collecte</h3>
        <div class="stat-value">{{ stats.totalPoints }}</div>
        <div class="stat-label">Total</div>
      </div>

      <div class="stat-card card">
        <h3>Véhicules</h3>
        <div class="stat-value">{{ stats.totalVehicules }}</div>
        <div class="stat-label">En service</div>
      </div>

      <div class="stat-card card">
        <h3>Taux de Remplissage</h3>
        <div class="stat-value">{{ stats.tauxRemplissage }}%</div>
        <div class="stat-label">Moyen</div>
      </div>
    </div>

    <!-- ... reste du composant ... -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const API_BASE = 'http://localhost:3000/api'

export default {
  name: 'Dashboard',
  setup() {
    const stats = ref({
      totalPoints: 0,
      totalVehicules: 0,
      tauxRemplissage: 0
    })

    const authStore = useAuthStore()

    // ... reste du code Dashboard ...

    return {
      stats,
      authStore
      // ... autres returns
    }
  }
}
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 2rem;
}

.welcome-message {
  color: #666;
  margin-top: 0.5rem;
}

/* ... reste des styles ... */
</style>