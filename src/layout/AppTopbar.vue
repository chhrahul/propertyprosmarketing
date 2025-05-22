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
    background-color: #10b981;
    border-radius: 50px;
}

.active-link button i {
    color: #ffffff;
}
</style>
