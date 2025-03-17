<template>
  <div class="container">
      <h2 class="section-title">Campaign Details</h2>

      <div v-if="promoterData.length" class="promotions-grid">
          <div 
              v-for="promotion in promoterData" 
              :key="promotion.id" 
              class="promotion-card"
              @click="openPromotion(promotion.referral_link)"
          >
              <h3 class="campaign-name">{{ promotion.campaign_name }}</h3>
              <p><strong>Status:</strong> 
                <span :class="promotion.status === 'offer_active' ? 'status-active' : 'status-inactive'">
                  {{ promotion.status }}
                </span>
              </p>

              <!-- Stats Cards -->
              <div class="stats-container">
                  <div class="stat-card visitors">
                      <h4>Visitors</h4>
                      <p>{{ promotion.visitors_count }}</p>
                  </div>
                  <div class="stat-card leads">
                      <h4>Leads</h4>
                      <p>{{ promotion.leads_count }}</p>
                  </div>
                  <div class="stat-card sales">
                      <h4>Sales</h4>
                      <p>{{ promotion.sales_count }}</p>
                  </div>
              </div>
          </div>
      </div>

      <p v-else class="no-promotions">No campaigns available.</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useFirstPromoterStore } from '@/store/firstPromoter';

const storeFirstPromoter = useFirstPromoterStore();
const promoterData = computed(() => storeFirstPromoter.getPromoterData);

onMounted(() => {
  console.log("Promoter Data:", promoterData.value);
});

const openPromotion = (link) => {
  window.open(link, "_blank");
};
</script>

<style scoped>
/* 🌟 Warm, Modern Design with Stat Cards 🌟 */

/* Background */
.container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  background:linear-gradient(to right, #1b2855, #30251e);
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  color: white;
}

/* Title */
.title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #ffdf91;
}

/* Section Title */
.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #f8f1e4;
}

/* Promotions Grid */
.promotions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* Promotion Card - Glassmorphism */
.promotion-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  text-align: center;
}

.promotion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.3);
}

/* Campaign Name */
.campaign-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #ffdf91;
}

/* Status Indicators */
.status-active {
  color: #f39c12;
  font-weight: bold;
}

.status-inactive {
  color: #e74c3c;
  font-weight: bold;
}

/* Stats Container */
.stats-container {
  display: flex;
  justify-content: space-around;
  gap: 15px;
  margin-top: 15px;
}

/* Individual Stat Card */
.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: scale(1.05);
}

/* Stat Card Colors */
.visitors {
  border-bottom: 3px solid #f1c40f; /* Gold */
}

.leads {
  border-bottom: 3px solid #e67e22; /* Warm Orange */
}

.sales {
  border-bottom: 3px solid #e74c3c; /* Red */
}

/* Stat Card Text */
.stat-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #fff;
}

.stat-card p {
  font-size: 20px;
  font-weight: 700;
  color: #ffdf91;
}

/* Visit Button */
.visit-btn {
  background: #d35400;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 15px;
  transition: background 0.3s ease, transform 0.2s ease-in-out;
}

.visit-btn:hover {
  background: #e67e22;
  transform: scale(1.05);
}

/* No Promotions Message */
.no-promotions {
  font-size: 18px;
  color: #f1f1f1;
  margin-top: 20px;
}
</style>