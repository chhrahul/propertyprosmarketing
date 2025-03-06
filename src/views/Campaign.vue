<template>
    <div>
        <h1>Campaigns</h1>
        
        <div v-if="campaigns.length" class="campaigns-container mt-6">
            <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
                <h4>{{ campaign.campaign_name.length > 18 ? campaign.campaign_name.substr(0, 18) + " ..." : campaign.campaign_name }}</h4>
                <p>Clicks: {{ campaign.visitors_count }}</p>
                <p>Leads: {{ campaign.leads_count }}</p>
                <p>Conversions: {{ campaign.sales_count }}</p>
            </div>
        </div>
        <p v-else>No campaigns found.</p>
    </div>
</template>

<script>
import { AuthService } from "../service/authService";

export default {
    data() {
        return {
            campaigns: []
        };
    },
    async mounted() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        const token = localStorage.getItem('token');
        const userpromoter = await AuthService.getUserMeta(auth.user.user.id,'promoterId',token);
        console.log(import.meta.env.VITE_PROMOTER_API_KEY);
        try {
            const options = {
                method: 'GET',
                headers: { 'X-API-KEY': import.meta.env.VITE_PROMOTER_API_KEY }
            };
            const response = await fetch(`https://firstpromoter.com/api/v1/promoters/show?id=${userpromoter.userpromoterId}`, options);
            const data = await response.json();
            // console.log(data);

            console.log("API Response:", data);

            if (data && data.promotions) {
                this.campaigns = data.promotions;
                console.log("Campaigns Updated:", this.campaigns);
            } else {
                console.warn("No campaigns found in API response.");
            }
            
            if (data && data.promotions) {
                this.campaigns = data.promotions;
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        }
    }
};
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
