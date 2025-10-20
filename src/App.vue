<template>
  <div id="app">


    <main :class="{ 'main-with-header': authStore.isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import 'vfonts/Lato.css'
import { defineComponent } from 'vue'
import { NButton } from 'naive-ui'
const router = useRouter();
const authStore = useAuthStore();
const initialized = ref(false);

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
onMounted(async () => {
  await authStore.initializeAuth();
  initialized.value = true;
});
</script>