<template>
    <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">Commissions ({{ filteredCommissions.length }})</h2>

        <!-- Status Tabs -->
        <ul class="flex border-b mb-4">
            <li v-for="tab in ['due', 'pending', 'paid']" :key="tab" class="mr-4">
                <a href="#" @click.prevent="activeTab = tab"
                    :class="{ 'active-tab': activeTab === tab, 'inactive-tab': activeTab !== tab }"
                    class="relative py-3 px-4 inline-block border-b-2 text-lg custom-tab">
                    {{ capitalize(tab) }}
                    <span v-if="totals[tab] > 0"
                        class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full shadow">
                        {{ totals[tab] }}
                    </span>
                </a>
            </li>
        </ul>

        <!-- Commission Table -->
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left border">
                <thead class="bg-gray-100 text-xs uppercase">
                    <tr>
                        <th class="px-4 py-3 text-base text-lg font-medium text-theme-color text-left"
                            v-for="(item, index) in  THEAD " :key="index">{{ item }}</th>
                    </tr>
                </thead>

                <tbody>
                    <!-- Loading State -->
                    <tr v-if="loading">
                        <td colspan="6" class="py-4 text-center text-sm">
                            <div class="flex justify-center items-center">
                                <svg class="animate-spin h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span>Loading Commissions...</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Empty State -->
                    <tr v-else-if="filteredCommissions.length === 0">
                        <td colspan="6" class="py-4 text-center">
                            <p class="text-sm">No {{ activeTab }} commissions found</p>
                        </td>
                    </tr>

                    <!-- Data Rows -->
                    <tr v-for="(commission, index) in filteredCommissions" :key="commission.id"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                        <td class="px-4 py-3 text-base text-sm text-theme-color">
                            {{ commission.sale.description }}
                            <span class="block text-sm">
                                1 x {{ commission.sale.description }} (at {{ commission.sale.sale_amount_cents /
            100 }}/each)
                            </span>
                        </td>
                        <td class="px-4 py-3 text-base text-sm text-theme-color">{{ formatDate(commission.created_at) }}
                        </td>
                        <td class="px-4 py-3 text-base text-sm text-theme-color">
                            <span class="font-mono text-sm">
                                {{ commission.sale.referral.customer.name || commission.sale.referral.id }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-base text-sm text-theme-color">
                            ${{ commission.sale.sale_amount_cents / 100 }} {{ commission.currency }}
                        </td>
                        <td class="px-4 py-3 text-base text-sm text-theme-color">
                            ${{ commission.amount / 100 }} {{ commission.currency }}
                        </td>
                        <td class="px-4 py-3 text-base text-sm text-theme-color">
                            <span :class="statusClasses[commission.state]"
                                class="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset">
                                {{ capitalize(commission.state) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { rewardfulService } from "../service/rewardfulService";
import { AuthService } from '@/service/AuthService';
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";

const THEAD = ["Description", "Date", "Customer", "Sale amount", "Your Commission", "Status"]

const store = useAuthStore();
const { getUser } = storeToRefs(store);

const commissionsData = ref([]);
const activeTab = ref("pending");
const loading = ref(false);
const firstLoad = ref(true);

const statusClasses = {
    paid: 'status-btn bg-green-50 text-green-700 ring-green-600/20',
    pending: 'status-btn bg-yellow-50 text-yellow-700 ring-yellow-600/20'
};

const fetchCommissionsData = async () => {
    let userId = getUser.value?.user?.id;
    if (!userId) return;

    if (firstLoad.value) loading.value = true;

    try {
        const affiliate_id = await AuthService.getUserMeta(userId, "affiliateId", getUser.value.token);
        const response = await rewardfulService.getCommissions({ affiliate_id });

        commissionsData.value = Array.isArray(response?.data?.data) ? response.data.data : [];
    } catch (error) {
        console.error("Error fetching commissions:", error);
        commissionsData.value = [];
    } finally {
        loading.value = false;
        firstLoad.value = false;
    }
};

onMounted(fetchCommissionsData);

const totals = computed(() => ({
    pending: commissionsData.value.filter(c => c.state === 'pending').length,
    paid: commissionsData.value.filter(c => c.state === 'paid').length
}));

const filteredCommissions = computed(() =>
    commissionsData.value.filter(commission => commission.state === activeTab.value)
);

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
</script>
