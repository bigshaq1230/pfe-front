<template>
  <div class="layout-container">
    <header class="app-header">

      <n-menu  :options="menuOptions" class="nav-menu" />
      <div class="nav-user">
        <span class="user-info">{{ authStore.user?.prenom }} {{ authStore.user?.nom }}</span>
        <n-tag :type="getRoleTagType(authStore.user?.role)" size="small">
          {{ getRoleLabel(authStore.user?.role) }}
        </n-tag>
        <n-button size="small" @click="handleLogout" type="error" ghost>
          Déconnexion
        </n-button>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';
import { RouterLink } from 'vue-router';
import {
  NMenu,
  NIcon,
  NTag,
  NButton
} from 'naive-ui';
import {
  Dashboard,
  Settings,
  Analytics,
  Document
} from "@vicons/carbon";

import { People} from '@vicons/ionicons5'
import {Route} from '@vicons/fa'

const router = useRouter();
const authStore = useAuthStore();

// Icon render helper
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// Menu options based on user role
const menuOptions = computed(() => {
  const baseOptions = [
    {
      label: () =>
        h(
          RouterLink,
          {
            to: "/dashboard"
          },
          { default: () => 'Tableau de Bord' }
        ),
      icon: renderIcon(Dashboard),
      key: 'dashboard'
    }
  ];

  // Gestion options for admin and gestionnaire
  if (authStore.hasAnyRole(['gestionnaire'])) {
    baseOptions.push({
      label: () =>
        h(
          RouterLink,
          {
            to: "/manage_employes"
          },
          { default: () => 'manage_employes' }
        ),
      icon: renderIcon(Settings),
      key: 'manage_employes'
    });
  }

  // Users management for admin only
  if (authStore.hasRole('admin')) {
    baseOptions.push({
      label: () =>
        h(
          RouterLink,
          {
            to: "/manage_users"
          },
          { default: () => 'manage_users' }
        ),
      icon: renderIcon(People),
      key: 'manage_users'
    });
  }



  // Rapports for admin, responsable_environnement, and gestionnaire
  if (authStore.hasAnyRole(['admin', 'responsable_environnement', 'gestionnaire'])) {
    baseOptions.push({
      label: () =>
        h(
          RouterLink,
          {
            to: "/rapports"
          },
          { default: () => 'Rapports' }
        ),
      icon: renderIcon(Analytics),
      key: 'rapports'
    });
  }

  return baseOptions;
});

const getRoleLabel = (role) => {
  const roles = {
    admin: 'Administrateur',
    gestionnaire: 'Gestionnaire',
    agent: 'Agent',
    responsable_environnement: 'Responsable Environnement'
  };
  return roles[role] || role;
};

const getRoleTagType = (role) => {
  const types = {
    admin: 'error',
    gestionnaire: 'warning',
    agent: 'info',
    responsable_environnement: 'success'
  };
  return types[role] || 'default';
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

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

