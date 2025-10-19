<template>
  <div id="app">
    <header v-if="authStore.isAuthenticated" class="app-header">
      <nav class="nav-container">
        <div class="nav-brand">
          <h1>🌱 EcoCollect</h1>
        </div>
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">Tableau de Bord</router-link>
        </div>
        <div class="nav-user">
          <span class="user-info">{{ authStore.user?.prenom }} {{ authStore.user?.nom }}</span>
          <span class="user-role">{{ getRoleLabel(authStore.user?.role) }}</span>
          <button @click="handleLogout" class="logout-btn">Déconnexion</button>
        </div>
      </nav>
    </header>

    <main :class="{ 'main-with-header': authStore.isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const canAccessGestion = computed(() =>
  authStore.hasAnyRole(['admin', 'gestionnaire'])
);

const canAccessRapports = computed(() =>
  authStore.hasAnyRole(['admin', 'responsable_environnement', 'gestionnaire'])
);

const getRoleLabel = (role) => {
  const roles = {
    admin: 'Administrateur',
    gestionnaire: 'Gestionnaire',
    agent: 'Agent',
    responsable_environnement: 'Responsable Environnement'
  };
  return roles[role] || role;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

// Initialize auth state when app starts
onMounted(() => {
  authStore.initializeAuth();
});
</script>