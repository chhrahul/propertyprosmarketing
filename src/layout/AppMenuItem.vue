<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    parentItemKey: {
        type: String,
        default: null
    }
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? `${props.parentItemKey}-${props.index}` : `${props.index}`;
    isActiveMenu.value = props.item.to === route.path;
});

watch(
    () => route.path,
    () => {
        isActiveMenu.value = props.item.to === route.path;
    },
    { immediate: true }
);

function itemClick(event, item) {
    if (item.label == "Logout") {
        localStorage.removeItem('token');
        router.push({ name: 'login' });
    }
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    if ((item.to || item.url) && (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)) {
        toggleMenu();
    }

    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value;

    setActiveMenuItem(foundItemKey);
}

</script>

<template>
    <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
        <h5 v-if="root && item.visible !== false" class="text-2xl font-medium">{{ item.label }}</h5>

        <router-link exactActiveClass="active-route" active-class="active-route"
            v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item, index)" tabindex="0"
            :to="item.to">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text" :class="{ 'active-route': isActiveMenu, 'lable-text': !isActiveMenu }">
                {{ item.label }}
            </span>

            <i class="pi pi-fw pi-angle-down layout-submenu-toggler  lable-text" v-if="item.items"></i>
        </router-link>

        <a v-else-if="!item.to && !item.items && item.visible !== false" href="#"
            @click.prevent="itemClick($event, item)" class="layout-menuitem-text"
            :style="{ color: isActiveMenu ? 'var(--active-link)' : 'var(--accent-end)' }">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span>{{ item.label }}</span>
        </a>

        <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
            <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child"
                    :parentItemKey="itemKey" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped>
.active-route {
    // font-weight: 600;
    color: var(--active-link) !important;
}

.active-route:hover {
    color: var(--active-link-hover) !important;
}

.lable-text {
    color: var(--accent-end);
}
</style>
