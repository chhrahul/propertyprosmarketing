<script setup>
import { useLayout } from '@/layout/composables/layout';
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
</script>
<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <div class="w-[126px]"><img src="../assets/Images/logo.webp" alt="Logo" class="layout-topbar-logo" />
                </div>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <router-link to="/profile" class="layout-config-menu"
                :class="{ 'active-link': $route.path === '/profile' }">
                <button type="button" class="layout-topbar-action">
                    <i class="pi pi-user"></i>
                </button>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.active-link {
    background: linear-gradient(to right, var(--accent-start), var(--accent-end));
    border-radius: 50%;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.active-link:hover {
    filter: brightness(1.1);
}

.active-link button i,
.active-link i {
    color: #fff;
    font-size: 1.25rem;
}
</style>
