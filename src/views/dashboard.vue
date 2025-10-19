<template>
  <div class="dashboard">
    <h1>Tableau de Bord</h1>
    <p>Bienvenue, {{ authStore.user?.prenom }} {{ authStore.user?.nom }}</p>
    <div class="user-info">
      <p><strong>Rôle:</strong> {{ getRoleLabel(authStore.user?.role) }}</p>
      <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
      <p><strong>Téléphone:</strong> {{ authStore.user?.telephone || 'Non renseigné' }}</p>
      <p><strong>Disponibilité:</strong> {{ getDisponibiliteLabel(authStore.user?.disponibilite) }}</p>
      <p><strong>Compétences:</strong> {{ authStore.user?.competences?.join(', ') || 'Aucune' }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const getRoleLabel = (role) => {
  const roles = {
    admin: 'Administrateur',
    gestionnaire: 'Gestionnaire',
    agent: 'Agent',
    responsable_environnement: 'Responsable Environnement'
  };
  return roles[role] || role;
};

const getDisponibiliteLabel = (disponibilite) => {
  const disponibilites = {
    disponible: 'Disponible',
    'en_congé': 'En congé',
    malade: 'Malade',
    'en_mission': 'En mission'
  };
  return disponibilites[disponibilite] || disponibilite;
};
</script>
