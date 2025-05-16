<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const dataParam = route.query.data;
if (dataParam) {
  try {
    const parsed = JSON.parse(decodeURIComponent(dataParam));
    authStore.setUserLoginDetail(parsed);
    router.push({ name: 'homeDash' });
  } catch (error) {
    console.error("Error parsing auth data", error);
    router.push({ name: 'login' });
  }
} else {
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-lg">Signing you in with Google...</p>
  </div>
</template>
