<template>
  <div class="vehicules">
    <div class="page-header">
      <h1>Gestion des Véhicules</h1>
      <p>Gérez votre flotte de véhicules de collecte</p>
    </div>

    <div class="table-container card">
      <table class="vehicules-table">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Type</th>
            <th>Capacité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicule in vehicules" :key="vehicule.id">
            <td>{{ vehicule.matricule }}</td>
            <td>{{ vehicule.type }}</td>
            <td>{{ vehicule.capacite }} tonnes</td>
            <td>
              <span :class="['badge', `badge-${vehicule.statut}`]">
                {{ vehicule.statut }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button
                  @click="viewVehicule(vehicule)"
                  class="btn-icon btn-view"
                  title="Voir détails"
                >
                  👁️
                </button>
                <button
                  @click="editVehicule(vehicule)"
                  class="btn-icon btn-edit"
                  title="Modifier"
                >
                  ✏️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue'
import { useVehiculesStore } from '@/stores/vehicules';

const vehiculesStore = useVehiculesStore();
const vehicules = ref([]);
const API_BASE = import.meta.env.VITE_API_BASE
const loadVehicules = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/vehicules');
    vehicules.value = response.data.data;
  } catch (error) {
    console.error('Erreur lors du chargement des véhicules:', error);
  }
}

const viewVehicule = (vehicule) => {
  console.log('Voir véhicule:', vehicule);
}

const editVehicule = (vehicule) => {
  console.log('Modifier véhicule:', vehicule);
}

onMounted(loadVehicules);
</script>

<style scoped>
.vehicules {
  padding: 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2e7d32;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.table-container {
  overflow-x: auto;
  padding: 1rem;
}

.vehicules-table {
  width: 100%;
  border-collapse: collapse;
}

.vehicules-table th,
.vehicules-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.vehicules-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-view:hover {
  background-color: #e3f2fd;
}

.btn-edit:hover {
  background-color: #e8f5e8;
}

.badge-actif {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.badge-inactif {
  background-color: #ffebee;
  color: #c62828;
}

.badge-maintenance {
  background-color: #fff3e0;
  color: #ef6c00;
}
</style>