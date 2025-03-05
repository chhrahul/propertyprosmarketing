<template>
    <div>
        <h1>My Campaigns</h1>
        <p>Track and manage your campaigns here.</p>
        
        <div v-if="campaigns.length" class="campaigns-container">
            <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
                <h2>{{ campaign.name }}</h2>
                <p>Clicks: {{ campaign.clicks }}</p>
                <p>Leads: {{ campaign.leads }}</p>
                <p>Conversions: {{ campaign.conversions }}</p>
            </div>
        </div>
        <p v-else>No campaigns found.</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            campaigns: [
                { id: 1, name: 'Campaign 1', clicks: 150, leads: 30, conversions: 5 },
                { id: 2, name: 'Campaign 2', clicks: 200, leads: 50, conversions: 10 }
            ]
        };
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