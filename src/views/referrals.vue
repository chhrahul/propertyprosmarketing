<template>
    <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">Referrals</h2>

        <ul class="flex border-b mb-4">
            <li class="mr-4">
                <a href="#" @click.prevent="setActiveTab('lead')"
                    :class="['py-3 px-4 inline-block border-b-2 custom-tab relative', activeTab === 'lead' ? 'active-tab' : 'inactive-tab']">

                    Leads
                    <span v-if="totalLeads !== 0"
                        class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full shadow">
                        {{ totalLeads }}
                    </span>
                </a>
            </li>
            <li>
                <a href="#" @click.prevent="setActiveTab('conversion')"
                    :class="['py-3 px-4 inline-block border-b-2 custom-tab relative', activeTab === 'conversion' ? 'active-tab' : 'inactive-tab']">
                    Conversion
                    <span v-if="totalConversions !== 0"
                        class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full shadow">
                        {{ totalConversions }}
                    </span>
                </a>
            </li>
        </ul>

        <div class="overflow-x-auto">
            <table class="w-full border">
                <thead class="bg-gray-100 uppercase">
                    <tr>
                        <th class="p-4 text-left px-4 py-3 text-base text-lg font-medium text-theme-color">Link</th>
                        <th class="text-center px-4 py-3 text-base text-lg font-medium text-theme-color">First click
                        </th>
                        <th class="text-center px-4 py-3 text-base text-lg font-medium text-theme-color">Became lead
                        </th>
                        <th v-if="activeTab === 'conversion'"
                            class="text-center px-4 py-3 text-base text-lg font-medium text-theme-color">Converted</th>
                        <th v-if="activeTab === 'conversion'"
                            class="px-4 py-3 text-base text-lg font-medium text-theme-color text-left">Subscription</th>
                        <th v-if="activeTab === 'lead'"
                            class="px-4 py-3 text-base text-lg font-medium text-theme-colortext-center">Customer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td colspan="6" class="py-4 text-center text-gray-500">
                            <div class="flex justify-center items-center">
                                <svg class="animate-spin h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span>Loading referrals...</span>
                            </div>
                        </td>
                    </tr>

                    <tr v-else-if="filteredReferrals.length === 0">
                        <td colspan="6" class="py-4 text-center">
                            <p class="text-sm">No result found.</p>
                        </td>
                    </tr>

                    <tr v-for="(referral, index) in filteredReferrals" :key="referral.id"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                        <td class="px-4 py-3 text-base text-sm  text-theme-color">
                            <a :href="referral.link?.url" class="hover:underline">{{ referral.link?.token
                        || 'N/A' }}
                            </a>
                        </td>
                        <td class="px-4 py-3 text-center text-base text-sm text-theme-color">{{
                        formatDate(referral.created_at) }}</td>
                        <td class="px-4 py-3 text-center text-base text-sm text-theme-color">{{
                        formatDate(referral.became_lead_at) || 'N/A' }}</td>
                        <td v-if="activeTab === 'conversion'"
                            class="px-4 py-3 text-center text-base text-sm text-theme-color">{{
                        formatDate(referral.became_conversion_at) || 'N/A' }}</td>
                        <td v-if="activeTab === 'conversion'"
                            class="px-4 py-3 text-center text-base text-sm text-theme-color">{{
                        capitalize(referral.conversion_state) }}</td>
                        <td v-if="activeTab === 'lead'"
                            class="px-4 py-3 text-center text-base text-sm text-theme-color">{{ referral.customer?.name
                        || 'N/A' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { rewardfulService } from "../service/rewardfulService";
import { AuthService } from '@/service/AuthService';
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";

const store = useAuthStore();
const { getUser } = storeToRefs(store);

const referralsData = ref([]);
const activeTab = ref("lead");
const loading = ref(false);

const fetchReferralsData = async () => {
    let userId = getUser.value?.user?.id;
    if (!userId) return;

    loading.value = true;

    try {
        const affiliateId = await AuthService.getUserMeta(userId, "affiliateId", getUser.value.token);
        const response = await rewardfulService.getReferrals(affiliateId);

        console.log("Response Data:", response?.data);

        referralsData.value = Array.isArray(response?.data?.data) ? response.data.data : [];
        console.log("Updated Referrals Data:", referralsData.value);
    } catch (error) {
        console.error("Error fetching referral data:", error);
        referralsData.value = [];
    } finally {
        loading.value = false;
    }
};

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

const totals = computed(() => {
    return referralsData.value.reduce((counts, referral) => {
        if (counts.hasOwnProperty(referral.conversion_state)) {
            counts[referral.conversion_state]++;
        }
        return counts;
    }, { lead: 0, conversion: 0 });
});

watchEffect(() => {
    console.log("Total Leads:", totals.value.lead);
    console.log("Total Conversions:", totals.value.conversion);
});
const totalLeads = computed(() => totals.value.lead);
const totalConversions = computed(() => totals.value.conversion);

const filteredReferrals = computed(() => {
    return referralsData.value.filter(referral => referral.conversion_state === activeTab.value);
});

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

onMounted(fetchReferralsData);
</script>

<style scoped>
.custom-tab {
    font-weight: 500;
    color: var(--accent-end);
    border-color: var(--accent-end);
    transition: all 0.3s ease;
}

.active-tab {
    color: var(--active-link);
    border-color: var(--active-link);
}

.active-tab:hover {
    color: var(--active-link-hover);
    border-color: var(--active-link-hover);
}

.inactive-tab {
    border-color: transparent;
}

.inactive-tab:hover {
    color: var(--active-link);
    border-color: var(--active-link);
}

svg.animate-spin {
    color: var(--accent-end);
}
</style>