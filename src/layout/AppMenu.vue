<script setup>
import { ref, computed } from "vue";
import AppMenuItem from "./AppMenuItem.vue";

const auth = ref(JSON.parse(localStorage.getItem("auth")) || {});

const model = computed(() =>
  [
    {
      label: "Home",
      items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/dashboard" }],
    },
    auth.value?.user?.user?.role !== "admin"
      ? {
          label: "",
          items: [
            { label: "Campaigns", icon: "pi pi-fw pi-megaphone", to: "/campaigns" },
          ],
        }
      : null,
    auth.value?.user?.user?.role === "admin"
      ? {
          items: [{ label: "Promoters", icon: "pi pi-fw pi-user", to: "/promoters" }],
        }
      : null,
    {
      label: "",
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "Logout",
          icon: "pi pi-fw pi-sign-in",
          to: "/",
        },
      ],
    },
  ].filter(Boolean)
);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="i">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
