<template>
    <div>
        <h1>Campaigns</h1>

        <ProgressSpinner v-if="loading" style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
            aria-label="Loading campaigns..." />

        <div v-else-if="campaigns.length" class="campaigns-container mt-6">
            <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card" @click="goToCampaignDetails(campaign.id)">
                <h4>{{ truncateText(campaign.campaign_name, 18) }}</h4>
                <p>Clicks: {{ campaign.visitors_count }}</p>
                <p>Leads: {{ campaign.leads_count }}</p>
                <p>Conversions: {{ campaign.sales_count }}</p>
            </div>
        </div>

        <p v-else>No campaigns found.</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "../service/authService";
import { fetchDashboardData } from "../service/firstPromoterService";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";
import { useFirstPromoterStore } from "@/store/firstPromoter";
import ProgressSpinner from 'primevue/progressspinner';

const store = useAuthStore();
const storeFirsPromoter = useFirstPromoterStore();
const { getUser } = storeToRefs(store);
const router = useRouter(); 
const campaigns = ref([]);
const loading = ref(true);

const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
};

const goToCampaignDetails = (campaignId) => {
    if (!campaignId) return;
    router.push({ name: "CampaignDetails", params: { id: campaignId } });
};

onMounted(async () => {
    try {
        let userId = getUser.value?.user?.id;
        if (!userId) return;

        const userpromoter = await AuthService.getUserMeta(userId, "promoterId");
        campaigns.value = await fetchDashboardData(userpromoter.userpromoterId);
        console.log(campaigns.value);
        storeFirsPromoter.setPromoterData(campaigns.value);

    } catch (error) {
        console.error("Error fetching campaigns:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.campaigns-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.campaign-card {
    background: #fff;
    padding: 15px;
    border-radius: 10px;
    width: 250px;
    text-align: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.campaign-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2);
}

h1 {
    color: #333;
}
</style>