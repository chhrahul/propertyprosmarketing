<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    // {
    //     label: '',
    //     icon: 'pi pi-shopping-cart',
    //     items: [
    //         {
    //             label: 'Products',
    //             icon: 'pi pi-shopping-cart',
    //             to: '/products'
    //         }
    //     ]
    // },
    {
        label: '',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Logout',
                icon: 'pi pi-fw pi-sign-in',
                to: '/'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
