<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { rewardfulService } from "../service/rewardfulService";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";
const store = useAuthStore();
const { getUser } = storeToRefs(store);

let userId = getUser.value?.user?.id;
        if (!userId) return;


const affiliateData = ref(null);
const campaignData = ref(null);

const fetchAffiliateData = async () => {
    try {
        const response = await rewardfulService.getAffiliate();
        affiliateData.value = response.data;
    } catch (error) {
        console.error("Error fetching affiliate data:", error);
    }
};

const fetchCampaignData = async () => {
    try {
        const response = await rewardfulService.getCampaign();
        campaignData.value = response.data;
    } catch (error) {
        console.error("Error fetching campaign data:", error);
    }
};

onMounted(() => {
    fetchAffiliateData();
    fetchCampaignData();
});

watchEffect(() => {
    console.log("Affiliate Data:", affiliateData.value);
    console.log("Campaign Data:", campaignData.value);
});

const commissionMessage = computed(() => {
    if (!campaignData.value) return "Loading commission details...";

    const commission = (campaignData.value.commission_amount_cents / 100).toFixed(2);
    const currency = campaignData.value.commission_amount_currency || "USD";

    if (campaignData.value.max_commissions && campaignData.value.max_commission_period_months) {
        return `$${commission} commission on the first ${campaignData.value.max_commissions} payments within the first ${campaignData.value.max_commission_period_months} months`;
    }

    if (campaignData.value.max_commissions) {
        return `$${commission} commission on the first ${campaignData.value.max_commissions} payments`;
    }

    return `$${commission} commission on all payments`;
});

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    }).catch((err) => {
        console.error("Failed to copy:", err);
    });
};
</script>

<template>
    <div class="bg-white p-6 shadow-lg rounded-lg">
        <div v-if="affiliateData">
            <div class="flex items-center justify-between mb-6 border-b pb-4">
                <h2 class="text-xl font-semibold">Dashboard</h2>
            </div>

            <div class="mb-6">
                <h5 class="text-lg font-medium mb-3">Referrals</h5>
                <table class="w-full border text-center">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-3">Visitors</th>
                            <th class="p-3">Leads</th>
                            <th class="p-3">Conversions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-t">
                            <td class="p-3">{{ affiliateData.visitors }}</td>
                            <td class="p-3">{{ affiliateData.leads }}</td>
                            <td class="p-3">{{ affiliateData.conversions }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex justify-between items-center mb-4">
                <h5 class="text-lg font-medium">Links</h5>
                <div class="text-sm text-gray-600 mb-3">
                    <strong>{{ campaignData?.name }}</strong>
                    <span class="mx-2">•</span>
                    {{ commissionMessage }}
                    <span class="mx-2">•</span>
                    Joined {{ new Date(affiliateData.created_at).toLocaleDateString() }}
                </div>

            </div>

            <div class="mb-6">
                <table class="w-full border text-center">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-3">Link</th>
                            <th class="p-3">Actions</th>
                            <th class="p-3">Visitors</th>
                            <th class="p-3">Leads</th>
                            <th class="p-3">Conversions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-t" v-for="link in affiliateData.links" :key="link.id">
                            <td class="p-3 text-left">
                                <a class="text-blue-500" :href="link.url" target="_blank">
                                    {{ link.url }}
                                </a>
                                <p class="text-sm text-gray-600">👉 Add <code>?via={{ link.token }}</code> to any URL.
                                </p>
                            </td>
                            <td class="p-3">
                                <button @click="copyToClipboard(link.url)"
                                    class="bg-blue-500 text-white px-3 py-1 rounded text-sm">Copy</button>
                            </td>
                            <td class="p-3">{{ link.visitors }}</td>
                            <td class="p-3">{{ link.leads }}</td>
                            <td class="p-3">{{ link.conversions }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="text-center text-gray-500">Loading data...</div>
    </div>
</template>