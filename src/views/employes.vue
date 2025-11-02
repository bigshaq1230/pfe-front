<template>
  <div class="employes">
    <div class="page-header">
      <h1>Gestion des Employés</h1>
      <p>Gérez le personnel de collecte et de maintenance</p>
    </div>

    <!-- Statistiques rapides -->
    <div class="stats-grid grid grid-4">
      <div class="stat-card card">
        <h3>Total Employés</h3>
        <div class="stat-value">{{ stats.total }}</div>
      </div>
      <div class="stat-card card">
        <h3>Actifs</h3>
        <div class="stat-value">{{ stats.actifs }}</div>
      </div>
      <div class="stat-card card">
        <h3>Disponibles</h3>
        <div class="stat-value">{{ stats.disponibles }}</div>
      </div>
      <div class="stat-card card">
        <h3>Taux Activation</h3>
        <div class="stat-value">{{ stats.tauxActivation }}%</div>
      </div>
    </div>

    <!-- Barre d'actions -->
    <div class="action-bar card">
      <div class="filters">
        <input
          type="text"
          v-model="filters.search"
          placeholder="Rechercher un employé..."
          class="search-input"
        >
        <select v-model="filters.statut" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
        <select v-model="filters.poste" class="filter-select">
          <option value="">Tous les postes</option>
          <option value="chauffeur">Chauffeur</option>
          <option value="agent-collecte">Agent de collecte</option>
          <option value="technicien-maintenance">Technicien maintenance</option>
        </select>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        + Nouvel Employé
      </button>
    </div>

    <!-- Tableau des employés -->
    <div class="table-container card">
      <table class="employes-table">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom & Prénom</th>
            <th>Poste</th>
            <th>Téléphone</th>
            <th>Zone</th>
            <th>Disponibilité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employe in employes" :key="employe.id">
            <td>
              <strong>EMP-{{ employe.id }}</strong>
            </td>
            <td>
              <div class="employe-info">
                <div class="employe-nom">{{ employe.prenom }} {{ employe.nom }}</div>
                <div class="employe-email">{{ employe.email }}</div>
              </div>
            </td>
            <td>
              <span class="badge badge-poste">{{ formatPoste(employe.poste) }}</span>
            </td>
            <td>{{ employe.telephone }}</td>
            <td>{{ employe.zoneAffectation }}</td>
            <td>
              <span :class="['badge', `badge-${employe.disponibilite}`]">
                {{ formatDisponibilite(employe.disponibilite) }}
              </span>
            </td>
            <td>
              <span :class="['badge', `badge-${employe.statut}`]">
                {{ employe.statut }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button
                  @click="viewEmploye(employe)"
                  class="btn-icon btn-view"
                  title="Voir détails"
                >
                  👁️
                </button>
                <button
                  @click="editEmploye(employe)"
                  class="btn-icon btn-edit"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  v-if="employe.statut === 'actif'"
                  @click="toggleEmployeStatus(employe)"
                  class="btn-icon btn-disable"
                  title="Désactiver"
                >
                  🚫
                </button>
                <button
                  v-else
                  @click="toggleEmployeStatus(employe)"
                  class="btn-icon btn-enable"
                  title="Activer"
                >
                  ✅
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination" v-if="pagination.totalPages > 1">
        <button
          @click="changePage(pagination.currentPage - 1)"
          :disabled="!pagination.hasPrev"
          class="btn-pagination"
        >
          Précédent
        </button>

        <span class="page-info">
          Page {{ pagination.currentPage }} sur {{ pagination.totalPages }}
        </span>

        <button
          @click="changePage(pagination.currentPage + 1)"
          :disabled="!pagination.hasNext"
          class="btn-pagination"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- Modal Ajout/Modification -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay">
      <div class="modal-content card">
        <h2>{{ showAddModal ? 'Ajouter un Employé' : 'Modifier l\'Employé' }}</h2>

        <form @submit.prevent="submitEmployeForm">
          <div class="form-grid">
            <div class="form-group">
              <label>Nom *</label>
              <input
                type="text"
                v-model="formData.nom"
                required
                placeholder="Nom de famille"
              >
            </div>

            <div class="form-group">
              <label>Prénom *</label>
              <input
                type="text"
                v-model="formData.prenom"
                required
                placeholder="Prénom"
              >
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input
                type="email"
                v-model="formData.email"
                required
                placeholder="email@example.com"
              >
            </div>

            <div class="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                v-model="formData.telephone"
                placeholder="+216 XX XXX XXX"
              >
            </div>

            <div class="form-group">
              <label>Poste *</label>
              <select v-model="formData.poste" required>
                <option value="">Sélectionner un poste</option>
                <option value="chauffeur">Chauffeur</option>
                <option value="agent-collecte">Agent de collecte</option>
                <option value="technicien-maintenance">Technicien maintenance</option>
                <option value="superviseur">Superviseur</option>
              </select>
            </div>

            <div class="form-group">
              <label>Date d'embauche *</label>
              <input
                type="date"
                v-model="formData.dateEmbauche"
                required
              >
            </div>

            <div class="form-group">
              <label>Salaire</label>
              <input
                type="number"
                v-model="formData.salaire"
                placeholder="Salaire mensuel"
              >
            </div>

            <div class="form-group">
              <label>Zone d'affectation</label>
              <select v-model="formData.zoneAffectation">
                <option value="Nord">Nord</option>
                <option value="Sud">Sud</option>
                <option value="Est">Est</option>
                <option value="Ouest">Ouest</option>
                <option value="Centre">Centre</option>
                <option value="Toutes zones">Toutes zones</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Spécialités</label>
              <div class="checkbox-group">
                <label v-for="specialite in specialites" :key="specialite">
                  <input
                    type="checkbox"
                    :value="specialite"
                    v-model="formData.specialite"
                  >
                  {{ formatSpecialite(specialite) }}
                </label>
              </div>
            </div>

            <div class="form-group full-width">
              <label>Permis</label>
              <div class="checkbox-group">
                <label v-for="permis in typesPermis" :key="permis">
                  <input
                    type="checkbox"
                    :value="permis"
                    v-model="formData.permis"
                  >
                  Permis {{ permis }}
                </label>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="closeModal"
              class="btn btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              {{ loading ? 'Enregistrement...' : (showAddModal ? 'Ajouter' : 'Modifier') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE

const employes = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingEmploye = ref(null)
const stats = ref({
  total: 0,
  actifs: 0,
  disponibles: 0,
  tauxActivation: 0
})

const filters = ref({
  search: '',
  statut: '',
  poste: ''
})

const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  hasNext: false,
  hasPrev: false
})

const formData = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  poste: '',
  specialite: [],
  dateEmbauche: '',
  salaire: 0,
  zoneAffectation: '',
  permis: []
})

const specialites = [
  'collecte-ordures',
  'maintenance-equipement',
  'reparation-vehicules'
]

const typesPermis = ['A', 'B', 'C', 'D', 'E']

// Computed pour les employés filtrés
const filteredEmployes = computed(() => {
  return employes.value
})

// Méthodes
const loadEmployes = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      ...filters.value
    })

    const response = await axios.get(`${API_BASE}/employes?${params}`)
    if (response.data.success) {
      employes.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Erreur lors du chargement des employés:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/employes/statistiques/general`)
    if (response.data.success) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.currentPage = page
    loadEmployes(page)
  }
}

const formatPoste = (poste) => {
  const postes = {
    'chauffeur': 'Chauffeur',
    'agent-collecte': 'Agent Collecte',
    'technicien-maintenance': 'Technicien',
    'superviseur': 'Superviseur'
  }
  return postes[poste] || poste
}

const formatDisponibilite = (disponibilite) => {
  const disponibilites = {
    'disponible': 'Disponible',
    'en-congé': 'En Congé',
    'en-mission': 'En Mission',
    'maladie': 'Maladie',
    'non-disponible': 'Non Disponible'
  }
  return disponibilites[disponibilite] || disponibilite
}

const formatSpecialite = (specialite) => {
  const specialites = {
    'collecte-ordures': 'Collecte Ordures',
    'tri-dechets': 'Tri Déchets',
    'conduite-poids-lourd': 'Conduite Poids Lourd',
    'maintenance-conteneurs': 'Maintenance Conteneurs',
    'reparation-vehicules': 'Réparation Véhicules',
    'relation-client': 'Relation Client',
    'gestion-equipe': 'Gestion Équipe'
  }
  return specialites[specialite] || specialite
}

const viewEmploye = (employe) => {
  // Implémenter la vue détaillée
  console.log('Voir employé:', employe)
}

const editEmploye = (employe) => {
  editingEmploye.value = employe
  formData.value = { ...employe }
  showEditModal.value = true
}

const toggleEmployeStatus = async (employe) => {
  try {
    const newStatus = employe.statut === 'actif' ? 'inactif' : 'actif'
    const newDisponibilite = newStatus === 'actif' ? 'disponible' : 'non-disponible'

    await axios.patch(`${API_BASE}/employes/${employe.id}`, {
      statut: newStatus,
      disponibilite: newDisponibilite
    })

    await loadEmployes(pagination.value.currentPage)
    await loadStats()
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error)
  }
}

const submitEmployeForm = async () => {
  loading.value = true
  try {
    if (showAddModal.value) {
      await axios.post(`${API_BASE}/employes`, formData.value)
    } else {
      await axios.put(`${API_BASE}/employes/${editingEmploye.value.id}`, formData.value)
    }

    closeModal()
    await loadEmployes(pagination.value.currentPage)
    await loadStats()
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingEmploye.value = null
  formData.value = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    specialite: [],
    dateEmbauche: '',
    salaire: 0,
    zoneAffectation: '',
    permis: []
  }
}

// Watchers pour les filtres
onMounted(() => {
  loadEmployes()
  loadStats()
})
</script>

<style scoped>
.employes {
  padding: 0;
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

.grid-4 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.table-container {
  overflow-x: auto;
}

.employes-table {
  width: 100%;
  border-collapse: collapse;
}

.employes-table th,
.employes-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.employes-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.employe-info .employe-nom {
  font-weight: 500;
}

.employe-info .employe-email {
  font-size: 0.8rem;
  color: #666;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.badge-poste {
  background-color: #e3f2fd;
  color: #1976d2;
}

.badge-actif {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.badge-inactif {
  background-color: #ffebee;
  color: #c62828;
}

.badge-disponible {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.badge-en-congé {
  background-color: #fff3e0;
  color: #ef6c00;
}

.badge-en-mission {
  background-color: #e3f2fd;
  color: #1976d2;
}

.badge-maladie {
  background-color: #fce4ec;
  color: #ad1457;
}

.badge-non-disponible {
  background-color: #f5f5f5;
  color: #757575;
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

.btn-disable:hover {
  background-color: #ffebee;
}

.btn-enable:hover {
  background-color: #e8f5e8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  width: 90%;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #2e7d32;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4caf50;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .action-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .filters {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .stats-grid.grid-4 {
    grid-template-columns: 1fr 1fr;
  }
}
</style>