<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Tableau de Bord</h1>
      <p class="welcome-message">Bienvenue, {{ authStore.userInfo.nom }} 👋</p>
    </div>

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

    <div class="map-section card">
      <h2>Carte des Points de Collecte</h2>
      <div class="map-container">
        <LMap ref="map" v-model:zoom="zoom" :center="center">
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        <LMarker v-for="point in pointsCollecte"
                :key="point.id"
                :lat-lng="[point.localisation.lat, point.localisation.lng]">
          <LPopup>
            <div class="marker-popup">
              <h3>Point de Collecte #{{ point.id }}</h3>
              <div class="fill-level">
                <div class="progress-bar">
                  <div class="progress" :style="{ width: point.niveauRemplissage + '%', backgroundColor: getFillColor(point.niveauRemplissage) }"></div>
                </div>
                <span>{{ point.niveauRemplissage }}% plein</span>
              </div>
              <p>Capacité max: {{ point.capaciteMax }} L</p>
              <p>Statut: {{ point.statut }}</p>
            </div>
          </LPopup>
        </LMarker>
      </LMap>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'

// Fix Leaflet's default icon path
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const API_BASE = 'http://localhost:3000/api'

const stats = ref({
  totalPoints: 0,
  totalVehicules: 0,
  tauxRemplissage: 0
})

const authStore = useAuthStore()
const pointsCollecte = ref([])
const zoom = ref(13)
const center = ref([34.75910, 10.73776]) // Centered on Tunisia

const getFillColor = (fillLevel) => {
  if (fillLevel >= 80) return '#dc3545' // Rouge pour niveau critique
  if (fillLevel >= 60) return '#ffc107' // Jaune pour niveau moyen
  return '#28a745' // Vert pour niveau bas
}

const loadPointsCollecte = async () => {
  try {
    const response = await axios.get(`${API_BASE}/points-collecte`)
    if (response.data.success) {
      pointsCollecte.value = response.data.data
      console.log('Points de collecte chargés:', pointsCollecte.value)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des points de collecte:', error)
  }
}

onMounted(async () => {
  console.log('Component mounted')
  await loadPointsCollecte()
  console.log('Current points:', pointsCollecte.value)
  console.log('Map center:', center.value)
})
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 2rem;
}

.welcome-message {
  color: #666;
  margin-top: 0.5rem;
}

.map-section {
  margin-top: 2rem;
  padding: 1rem;
}

.map-section h2 {
  margin-bottom: 1rem;
  color: #2e7d32;
}

.map-container {
  height: 500px;
  width: 100%;
  position: relative;
  z-index: 0;
}

:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  border-radius: 8px;
}

.marker-popup {
  padding: 0.5rem;
}

.marker-popup h3 {
  margin-bottom: 0.5rem;
  color: #2e7d32;
}

.fill-level {
  margin: 0.5rem 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress {
  height: 100%;
  transition: width 0.3s ease;
}

/* Pour s'assurer que la carte s'affiche correctement */
:deep(.leaflet-marker-icon) {
  width: 25px !important;
  height: 41px !important;
}
</style>