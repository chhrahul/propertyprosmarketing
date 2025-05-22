<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { storeToRefs } from "pinia";
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from "@/store/auth";
import { AuthService } from '@/service/AuthService';
import { showToast } from '@/utils/Helper'
import { PROPERTY_PROS_MARKETING_URL } from '@/utils/Enums'
import { rewardfulService } from "../service/rewardfulService";

const THEAD = ["Label", "URL", "Visitors", "Leads", "Conversions", "Copy"]

const store = useAuthStore();
const toast = useToast();
const { getUser } = storeToRefs(store);

const affiliateData = ref(null);
const campaignData = ref(null);
const isModalOpen = ref(false);
const newLinkToken = ref('');
const loading = ref(false);
const newLinkLabel = ref('');

const fetchAffiliateData = async () => {
    let userId = getUser.value?.user?.id;
    if (!userId) return;
    try {
        const affiliateId = await AuthService.getUserMeta(userId, "affiliateId", getUser.value.token);
        if (!affiliateId) return;
        const response = await rewardfulService.getAffiliate(affiliateId);
        affiliateData.value = response.data;
        fetchCampaignData();
    } catch (error) {
        showToast(toast, "error", "Error", error);
    }
};

const fetchCampaignData = async () => {
    if (!affiliateData.value || !affiliateData.value.campaign) return;
    const campaignId = affiliateData.value.campaign.id;
    if (!campaignId) return;
    try {
        const response = await rewardfulService.getCampaign(campaignId);
        campaignData.value = response.data;
    } catch (error) {
        showToast(toast, "error", "Error", error);
    }
};

onMounted(() => {
    fetchAffiliateData();
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
    }).catch((error) => {
        showToast(toast, "error", "Error", error);
    });
};

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
    newLinkToken.value = '';
}


const createNewLink = async () => {
    if (newLinkToken.value.trim() === '') {
        showToast(toast, "error", "Error", 'Token cannot be empty!');
        return;
    }

    try {
        const userId = getUser.value?.user?.id;
        const affiliateId = await AuthService.getUserMeta(userId, "affiliateId", getUser.value.token);

        if (!affiliateId) {
            showToast(toast, "error", "Error", "Affiliate ID not found.");
            return;
        }
        loading.value = true;

        const payload = {
            affiliate_id: affiliateId,
            token: newLinkToken.value.trim()
        };

        if (newLinkLabel.value.trim()) {
            payload.label = newLinkLabel.value.trim();
        }

        const response = await rewardfulService.createNewAffiliateLink(payload);

        if (response?.error) {
            showToast(toast, "error", "Error", response?.error);
            return;
        }
        closeModal();
        await fetchAffiliateData();

    } catch (error) {
        showToast(toast, "error", "Error", error);
        closeModal();
    } finally {
        loading.value = false;
    }
}

const formattedCommissionStats = computed(() => {
    const stats = affiliateData.value?.commission_stats?.currencies?.USD;

    const formatCents = (cents) => `$${(cents / 100).toFixed(2)}`;

    return {
        unpaid: stats ? formatCents(stats.unpaid?.cents || 0) : "$0.00",
        paid: stats ? formatCents(stats.paid?.cents || 0) : "$0.00",
        total: stats ? formatCents(stats.total?.cents || 0) : "$0.00",
        grossRevenue: stats ? formatCents(stats.gross_revenue?.cents || 0) : "$0.00",
        netRevenue: stats ? formatCents(stats.net_revenue?.cents || 0) : "$0.00"
    };
});

</script>

<template>
    <div class="bg-white p-6 shadow-lg rounded-lg">
        <div v-if="affiliateData">
            <div class="mb-6">
                <div class="mb-6">
                    <h5 class="text-2xl font-medium mb-4 gradient-heading">Referrals Overview</h5>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div
                            class="transition-shadow hover:shadow-lg hover:-translate-y-0.5
 p-4 rounded-lg shadow transition-all transform hover:scale-[1.01] border border-blue-100 bg-gradient-to-r from-blue-100 via-blue-50 to-white">

                            <div
                                class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                                <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path d="M17 20h5v-2a4 4 0 00-3-3.87" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M9 20H4v-2a4 4 0 013-3.87" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <circle cx="9" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" />
                                    <circle cx="17" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide lable-text">Total
                                    Visitors</p>
                                <p class="text-2xl font-bold text-gray-800 mt-1">{{ affiliateData.visitors }}</p>
                            </div>
                        </div>

                        <div
                            class=" transition-shadow hover:shadow-lg hover:-translate-y-0.5
p-4 rounded-lg shadow transition-all transform hover:scale-[1.01] border border-green-100 bg-gradient-to-r from-green-100 via-green-50 to-white">
                            <div
                                class="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/10 text-green-600">

                                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path d="M3 10h11M9 21V3m0 0l3 3m-3-3L6 6" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide lable-text">Total
                                    Leads</p>
                                <p class="text-2xl font-bold text-gray-800 mt-1">{{ affiliateData.leads }}</p>
                            </div>
                        </div>

                        <div
                            class="transition-shadow hover:shadow-lg hover:-translate-y-0.5
 p-4 rounded-lg shadow transition-all transform hover:scale-[1.01] border border-yellow-100 bg-gradient-to-r from-yellow-100 via-yellow-50 to-white">
                            <div
                                class="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/10 text-yellow-600">
                                <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide lable-text">Total
                                    Conversions
                                </p>
                                <p class="text-2xl font-bold text-gray-800 mt-1">{{ affiliateData.conversions }}</p>
                            </div>
                        </div>

                        <div
                            class="transition-shadow hover:shadow-lg hover:-translate-y-0.5
 p-4 rounded-lg shadow transition-all transform hover:scale-[1.01] border border-red-100 bg-gradient-to-r from-red-100 via-red-50 to-white">
                            <div
                                class="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 text-red-600">
                                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path d="M12 8v4l3 3" stroke-linecap="round" stroke-linejoin="round" />
                                    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide lable-text">
                                    Commission Pending
                                </p>
                                <p class="text-2xl font-bold text-gray-800 mt-1">{{ formattedCommissionStats.unpaid }}
                                </p>
                            </div>
                        </div>

                        <div
                            class="transition-shadow hover:shadow-lg hover:-translate-y-0.5
 p-4 rounded-lg shadow transition-all transform hover:scale-[1.01] border border-purple-100 bg-gradient-to-r from-purple-100 via-purple-50 to-white">
                            <div
                                class="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 text-purple-600">
                                <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path d="M12 8v4l3 3" stroke-linecap="round" stroke-linejoin="round" />
                                    <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide lable-text">
                                    Commission Paid</p>
                                <p class="text-2xl font-bold text-gray-800 mt-1">{{ formattedCommissionStats.paid }}</p>
                            </div>
                        </div>


                    </div>
                </div>

            </div>

            <div class="flex flex-wrap justify-between items-center mb-4">
                <h5 class="text-lg font-medium w-full sm:w-auto mb-2 sm:mb-0">Links</h5>
                <div class="text-sm text-gray-600 w-full sm:w-auto text-center sm:text-right">
                    <h1 class="font-medium text-1xl sm:text-1xl text-theme-color gradient-heading">
                        Earn 10% Recurring/month for any client that comes from your affiliate link and works withus.
                    </h1>
                </div>
            </div>

            <div class="mb-6 overflow-x-auto">
                <table class="w-full text-sm text-left border-collapse">
                    <thead class="bg-gray-100 text-xs uppercase">
                        <tr>
                            <th :class="[(index !== 0 && index !== 1) ? 'text-center' : '', 'px-4 py-3 text-base sm:text-medium font-medium text-theme-color']"
                                v-for="(item, index) in  THEAD " :key="index">{{ item }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="( link, index ) in  affiliateData.links " :key="link.id"
                            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                            <td class="px-4 py-3 text-base text-sm  text-theme-color">
                                {{ link.label || '—' }}
                            </td>
                            <td class="px-4 py-3 text-base text-sm  text-theme-color">
                                <a class="text-blue-500 break-all"
                                    :href="PROPERTY_PROS_MARKETING_URL + 'schedule-call?via=' + link.token"
                                    target="_blank">
                                    {{ PROPERTY_PROS_MARKETING_URL + 'schedule-call?via=' + link.token }}
                                </a>
                            </td>
                            <td class="px-4 py-3 text-center text-base text-sm text-theme-color">{{
            link.visitors }}</td>
                            <td class="px-4 py-3 text-center text-base text-sm text-theme-color">{{
            link.leads }}</td>
                            <td class="px-4 py-3 text-center text-base text-sm  text-theme-color">{{
            link.conversions }}</td>
                            <td class="px-4 py-3 text-center text-base text-sm text-theme-color">
                                <button
                                    @click="copyToClipboard(PROPERTY_PROS_MARKETING_URL + 'schedule-call?via=' + link.token)"
                                    class="copy-button flex items-center justify-center gap-2 hover:bg-blue-600 text-white px-3 py-1 rounded transition-all text-sm font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8l6 6v8a2 2 0 01-2 2h-2M8 16v2a2 2 0 002 2h6M8 16h8" />
                                    </svg>
                                    Copy
                                </button>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="flex justify-center items-center py-10">
            <svg aria-hidden="true" class="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor" />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill" />
            </svg>
        </div>

        <div v-if="isModalOpen"
            class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 create_affiliate_link_modal">
            <div class="panel bg-white rounded-lg shadow-lg">
                <h5 class="text-2xl font-medium mb-3 gradient-heading">Create a new link</h5>
                <form class="new_affiliate_link" id="new_affiliate_link" @submit.prevent="createNewLink">
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">{{ PROPERTY_PROS_MARKETING_URL }}?via=</span>
                            <input v-model="newLinkToken" required autofocus placeholder="your-token"
                                pattern="[a-zA-Z0-9\-]+" class="form-control" type="text" name="affiliate_link[token]"
                                id="affiliate_link_token">

                        </div>
                        <h5 class="text-base text-sm font-medium text-theme-color">Letters, numbers, and dashes only,
                            please.</h5>
                    </div>

                    <div class="mb-3">
                        <label class="block text-base sm:text-medium font-medium mb-2 text-theme-color">Optional
                            Label</label>
                        <input v-model="newLinkLabel" placeholder="e.g. Instagram Bio Link"
                            class="w-full border rounded px-3 py-2 text-sm" type="text" />
                    </div>

                    <div class="flex justify-end space-x-2 mt-4">
                        <!-- <button type="button" @click="closeModal"
                            class="bg-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-400" :disabled="loading">
                            Cancel
                        </button> -->

                        <button type="button" @click="closeModal"
                            class="cancel-button items-center justify-center gap-2" :disabled="loading">
                            Cancel
                        </button>

                        <button type="submit" :disabled="loading"
                            class="create-link-btn text-white font-semibold px-4 rounded-lg shadow transition duration-200">
                            <i v-if="loading" class="pi pi-spinner pi-spin text-white"></i>
                            <span class="ml-2">
                                {{ loading ? '+ Create Link' : '+ Create Link' }}
                            </span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>

    <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md p-4 z-50">
        <div class="mx-auto flex justify-end">
            <button @click="openModal"
                class="create-link-btn text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200">
                + Create New Link
            </button>
        </div>
    </div>

</template>

<style scoped>
.cancel-button {
    background-color: #f9fbfc !important;
    color: #333333 !important;
    border: 1px solid #dcdcdc;
    font-weight: 600;
    border-radius: 8px;
    padding: 0.75rem 1.25rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cancel-button:hover {
    background-color: #f1f1f1 !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    cursor: pointer !important;
    border: 1px solid #f1f1f1 !important;
}

.cancel-button:focus-visible {
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.4) !important;
}

.bg-white.p-6.shadow-lg.rounded-lg {
    padding-bottom: 6rem;
}

a {
    color: var(--active-link) !important;
}

a:hover {
    color: var(--active-link-hover) !important;
}

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

.create-link-btn {
    background-image: linear-gradient(to right, var(--accent-start), var(--accent-end)) !important;
    color: white;
    border: none !important;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.create-link-btn:hover {
    filter: brightness(1.1) !important;
    box-shadow: 1px 2px 10px 2px rgba(0, 0, 0, 0.2) !important;
}

.lable-text {
    color: var(--accent-end) !important;
}
</style>