<template>
    <div class="bg-white p-6 shadow-lg rounded-lg">
        <div class="flex items-center justify-between mb-6 border-b pb-4">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <i class="pi pi-wallet"></i> Commission
            </h2>
        </div>
        <table class="w-full text-center border border-gray-200">
            <thead class="bg-gray-100">
                <tr>
                    <th class="py-2 px-4 border">Unpaid Commission</th>
                    <th class="py-2 px-4 border">Paid Commission</th>
                    <th class="py-2 px-4 border">Total Commission</th>
                    <th class="py-2 px-4 border">Gross Revenue</th>
                    <th class="py-2 px-4 border">Net Revenue</th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-white">
                    <td class="py-3 px-4 border">
                        ${{ (commissionStats?.unpaid?.cents || 0) / 100 }} USD
                    </td>
                    <td class="py-3 px-4 border">
                        ${{ (commissionStats?.paid?.cents || 0) / 100 }} USD
                    </td>
                    <td class="py-3 px-4 border">
                        ${{ (commissionStats?.total?.cents || 0) / 100 }} USD
                    </td>
                    <td class="py-3 px-4 border">
                        ${{ (commissionStats?.gross_revenue?.cents || 0) / 100 }} USD
                    </td>
                    <td class="py-3 px-4 border">
                        ${{ (commissionStats?.net_revenue?.cents || 0) / 100 }} USD
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";
import { AuthService } from '@/service/authService';
import { rewardfulService } from "@/service/rewardfulService";

const store = useAuthStore();
const { getUser } = storeToRefs(store);

const affiliateData = ref(null);
const commissionStats = ref(null);

const fetchAffiliateData = async () => {
    let userId = getUser.value?.user?.id;
    if (!userId) return;

    try {
        const affiliateId = await AuthService.getUserMeta(userId, "affiliateId",getUser.value.token);
        if (!affiliateId) return;

        const response = await rewardfulService.getAffiliate(affiliateId);
        affiliateData.value = response.data;

        // Extract commission stats for USD
        commissionStats.value = response.data?.commission_stats?.currencies?.USD || {};

        console.log("Affiliate Data:", affiliateData.value);
        console.log("Commission Stats:", commissionStats.value);
    } catch (error) {
        console.error("Error fetching affiliate data:", error);
    }
};

onMounted(fetchAffiliateData);
</script>