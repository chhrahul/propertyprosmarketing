<template>
    <div>
        <h1>Campaigns</h1>
        <ProgressSpinner v-if="campaigns.length == 0" style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
            aria-label="Custom ProgressSpinner" />
        <div v-else-if="campaigns.length" class="campaigns-container mt-6">
            <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
                <h4>{{ campaign.campaign_name.length > 18 ? campaign.campaign_name.substr(0, 18) + " ..." :
                    campaign.campaign_name }}</h4>
                <p>Clicks: {{ campaign.visitors_count }}</p>
                <p>Leads: {{ campaign.leads_count }}</p>
                <p>Conversions: {{ campaign.sales_count }}</p>
            </div>
        </div>
        <p v-else>No campaigns found.</p>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { AuthService } from "../service/authService";
import { fetchDashboardData } from "../service/firstPromoterService";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";
import ProgressSpinner from 'primevue/progressspinner';
const store = useAuthStore();
const { getUser } = storeToRefs(store);
let campaigns = ref([]);

onMounted(async () => {
    let userId = getUser.value?.user?.id;
    const userpromoter = await AuthService.getUserMeta(userId, 'promoterId');
    campaigns.value = await fetchDashboardData(userpromoter.userpromoterId);
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
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 250px;
    text-align: center;
}

h1 {
    color: #333;
}
</style>
