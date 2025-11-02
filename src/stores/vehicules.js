import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

export const useVehiculesStore = defineStore('vehicules', () => {
  const vehicules = ref([])
  const currentVehicule = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const vehiculesDisponibles = computed(() =>
    vehicules.value.filter(v => v.statut === 'disponible')
  )

  const vehiculesEnMaintenance = computed(() =>
    vehicules.value.filter(v => v.statut === 'en-maintenance')
  )

  const vehiculesEnMission = computed(() =>
    vehicules.value.filter(v => v.statut === 'en-mission')
  )

  const vehiculesByType = computed(() => {
    return vehicules.value.reduce((acc, vehicule) => {
      const type = vehicule.type
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(vehicule)
      return acc
    }, {})
  })

  // Actions
  const fetchVehicules = async (filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()

      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key])
        }
      })

      const response = await axios.get(`${API_BASE}/vehicules?${params}`)

      if (response.data.success) {
        vehicules.value = response.data.data
        return response.data.data
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Erreur lors du chargement des véhicules'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const fetchVehicule = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(`${API_BASE}/vehicules/${id}`)

      if (response.data.success) {
        currentVehicule.value = response.data.data
        return response.data.data
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Erreur lors de la récupération du véhicule'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const createVehicule = async (vehiculeData) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(`${API_BASE}/vehicules`, vehiculeData)

      if (response.data.success) {
        vehicules.value.push(response.data.data)
        return response.data.data
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Erreur lors de la création du véhicule'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const updateVehicule = async (id, vehiculeData) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`${API_BASE}/vehicules/${id}`, vehiculeData)

      if (response.data.success) {
        const index = vehicules.value.findIndex(v => v.id === id)
        if (index !== -1) {
          vehicules.value[index] = response.data.data
        }
        if (currentVehicule.value && currentVehicule.value.id === id) {
          currentVehicule.value = response.data.data
        }
        return response.data.data
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Erreur lors de la mise à jour du véhicule'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const updateVehiculeStatus = async (id, statut) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.patch(`${API_BASE}/vehicules/${id}`, { statut })

      if (response.data.success) {
        const index = vehicules.value.findIndex(v => v.id === id)
        if (index !== -1) {
          vehicules.value[index].statut = statut
        }
        if (currentVehicule.value && currentVehicule.value.id === id) {
          currentVehicule.value.statut = statut
        }
        return response.data.data
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Erreur lors du changement de statut'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const getVehiculesDisponibles = async () => {
    return await fetchVehicules({ statut: 'disponible' })
  }

  const getVehiculesByType = async (type) => {
    return await fetchVehicules({ type })
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    vehicules,
    currentVehicule,
    loading,
    error,

    // Getters
    vehiculesDisponibles,
    vehiculesEnMaintenance,
    vehiculesEnMission,
    vehiculesByType,

    // Actions
    fetchVehicules,
    fetchVehicule,
    createVehicule,
    updateVehicule,
    updateVehiculeStatus,
    getVehiculesDisponibles,
    getVehiculesByType,
    clearError
  }
})