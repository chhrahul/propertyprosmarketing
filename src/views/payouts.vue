<template>
    <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">Payouts</h2>
        <ul class="flex border-b mb-4">
            <li class="mr-4">
                <a href="#" @click.prevent="activeTab = 'due'"
                    :class="['py-3 px-4 inline-block border-b-2 custom-tab relative', activeTab === 'due' ? 'active-tab' : 'inactive-tab']">
                    Due
                    <span v-if="totals.due !== 0"
                        class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full shadow">
                        {{ totals.due }}
                    </span>
                </a>
            </li>
            <li class="mr-4">
                <a href="#" @click.prevent="activeTab = 'pending'"
                    :class="['py-3 px-4 inline-block border-b-2 custom-tab relative', activeTab === 'pending' ? 'active-tab' : 'inactive-tab']">
                    Pending
                    <span v-if="totals.pending !== 0"
                        class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full shadow">
                        {{ totals.pending }}
                    </span>
                </a>
            </li>
            <li>
                <a href="#" @click.prevent="activeTab = 'paid'"
                    :class="['py-3 px-4 inline-block border-b-2 custom-tab relative', activeTab === 'paid' ? 'active-tab' : 'inactive-tab']">
                    Paid
                    <span v-if="totals.paid !== 0"
                        class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full shadow">
                        {{ totals.paid }}
                    </span>
                </a>
            </li>
        </ul>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="w-full text-left border">
                <thead class="bg-gray-100 uppercase">
                    <tr>
                        <th :class="[index !== 0 ? 'text-center' : '', 'px-4 py-3 text-base text-lg font-medium text-theme-color']"
                            v-for="(item, index) in  THEAD " :key="index">{{ item }}</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Loading State -->
                    <tr v-if="loading">
                        <td colspan="4" class="py-4 text-center text-gray-500">
                            <div class="flex justify-center items-center">
                                <svg class="animate-spin h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span>Loading Payouts...</span>
                            </div>
                        </td>
                    </tr>

                    <!-- No Data Found -->
                    <tr v-else-if="filteredPayouts.length === 0">
                        <td colspan="4" class="py-4 text-center">
                            <p class="text-sm">No {{ activeTab }} payouts.</p>
                        </td>
                    </tr>

                    <!-- Data Rows -->
                    <tr v-for="(payout,index) in filteredPayouts" :key="payout.id"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                        <td class="px-4 py-3 text-base text-sm  text-theme-color">
                            <span
                                class="inline-flex items-center rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
                                :class="statusClasses[payout.state]">
                                {{ capitalize(payout.state) }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-base text-sm  text-theme-color text-center">{{ payout.amount / 100 }}
                            {{ payout.currency }}</td>
                        <td class="px-4 py-3 text-base text-sm  text-theme-color text-center">{{
                        formatDate(payout.paid_at) || 'N/A' }}</td>
                        <td class="px-4 py-3 text-base text-sm  text-theme-color text-center">
                            <router-link :to="`/payoutDetails/${payout.id}`" class="hover:text-blue-500">
                                <button type="button"
                                    class="copy-button flex items-center justify-center gap-2 hover:bg-blue-600 text-white px-3 py-1 rounded transition-all text-sm font-medium">
                                    View Details
                                </button>
                            </router-link>
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

const THEAD = ["State", "Amount", "Paid", "Action"]

const statusClasses = {
    paid: 'status-btn bg-green-50 text-green-700 ring-green-600/20',
    pending: 'status-btn bg-yellow-50 text-yellow-700 ring-yellow-600/20'
};

const store = useAuthStore();
const { getUser } = storeToRefs(store);

const payoutsData = ref([]);
const activeTab = ref("due");
const loading = ref(false);
const firstLoad = ref(true);

const fetchPayoutsData = async () => {
    let userId = getUser.value?.user?.id;
    if (!userId) return;

    if (firstLoad.value) loading.value = true;

    try {
        const affiliate_id = await AuthService.getUserMeta(userId, "affiliateId", getUser.value.token);
        const response = await rewardfulService.getPayouts({ affiliate_id });

        payoutsData.value = Array.isArray(response?.data?.data) ? response.data.data : [];
        console.log("Updated Payouts Data:", payoutsData.value);
    } catch (error) {
        console.error("Error fetching payout data:", error);
        payoutsData.value = [];
    } finally {
        loading.value = false;
        firstLoad.value = false;
    }
};

onMounted(fetchPayoutsData);

const totals = computed(() => {
    const counts = { due: 0, pending: 0, paid: 0 };
    payoutsData.value.forEach(payout => {
        if (counts[payout.state] !== undefined) {
            counts[payout.state]++;
        }
    });
    return counts;
});

const filteredPayouts = computed(() => {
    return payoutsData.value.filter(payout => payout.state === activeTab.value);
});

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

</script>

<style scoped>
.copy-button {
    background-image: linear-gradient(to right, var(--accent-start), var(--accent-end));
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-size: 0.875rem;
}

.copy-button:hover {
    filter: brightness(1.1);
    box-shadow: 1px 2px 10px 2px rgba(0, 0, 0, 0.2);
}

.copy-button svg {
    color: white;
    stroke: currentColor;
}
</style>