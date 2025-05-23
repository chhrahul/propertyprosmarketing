<template>
    <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between mb-4">
            <h5 class="text-2xl font-medium">Payout Details</h5>
            <router-link to="/payouts" class="btn flex items-center gap-2 text-white font-medium rounded-lg text-sm">
                <i class="pi pi-chevron-left text-base"></i>
                <span>Payouts</span>
            </router-link>
        </div>

        <p class="mt-1 mb-4" :style="{ color: 'var(--accent-end)' }">
            Updated <span class="font-medium">{{ formatDate(payoutsData.paid_at) }}</span>
        </p>

        <div class="overflow-x-auto">
            <table class="w-full border text-left mb-3">
                <thead class="bg-gray-100 uppercase">
                    <tr>
                        <th class="px-4 py-3 text-base text-lg font-medium text-theme-color"
                            v-for="(item, index) in  THEAD " :key="index">{{ item }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loadingPayouts">
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
                    <tr class="border-t" v-if="payoutsData.length !== 0">
                        <td class="p-4 text-left">
                            <span
                                class="inline-flex items-center rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
                                :class="statusClasses[payoutsData.state]">
                                {{ capitalize(payoutsData.state) }}
                            </span>
                        </td>
                        <td class="p-4">{{ payoutsData.amount / 100 }} {{ payoutsData.currency }}</td>
                        <td class="p-4">{{ formatDate(payoutsData.paid_at) || 'N/A' }}</td>
                        <td class="p-4">{{ payoutsData.paid_by_id }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h5 class="text-2xl font-medium">Commissions Included in This Payout</h5>
        <div class="overflow-x-auto">
            <table class="w-full border text-left mb-3 mt-3">
                <thead class="bg-gray-100 uppercase">
                    <tr>
                        <th class="px-4 py-3 text-base text-lg font-medium text-theme-color"
                            v-for="(item, index) in  THEAD_COMMISSIONS " :key="index">{{ item }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loadingCommission">
                        <td colspan="6" class="py-4 text-center text-gray-500">
                            <div class="flex justify-center items-center">
                                <svg class="animate-spin h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4">
                                    </circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span>Loading Commissions...</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(commission, index) in commissionsData" :key="commission.id"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                        <td class="p-4 text-left">
                            {{ commission.sale.description }}
                            <span class="block text-sm">
                                1 x {{ commission.sale.description }} (at {{ commission.sale.sale_amount_cents / 100
                                }}/each)
                            </span>
                        </td>
                        <td class="p-4 text-left">{{ formatDate(commission.created_at) }}</td>
                        <td class="p-4 text-left"> {{ commission.sale.referral.customer.name ||
            commission.sale.referral.id }} </td>
                        <td class="p-4 text-left">
                            ${{ commission.sale.sale_amount_cents / 100 }} {{ commission.currency }}
                        </td>
                        <td class="p-4 text-left">
                            ${{ commission.amount / 100 }} {{ commission.currency }}
                        </td>
                        <td class="p-4 text-left">
                            <span :class="statusClasses[commission.state]"
                                class="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset">
                                {{ capitalize(commission.state) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { rewardfulService } from "../service/rewardfulService";
import { useRoute } from 'vue-router';

const route = useRoute();
const payoutId = ref(route.params.id);
const payoutsData = ref([]);
const commissionsData = ref([]);
const loadingPayouts = ref(false);
const loadingCommission = ref(false);
const THEAD = ["State", "Amount", "Paid at", "Paid by"]
const THEAD_COMMISSIONS = ["Description", "Date", "Customer", "Sale Amount", "Your Commission", "Status"]
const statusClasses = {
    paid: 'status-btn bg-green-50 text-green-700 ring-green-600/20',
    pending: 'status-btn bg-yellow-50 text-yellow-700 ring-yellow-600/20'
};

const fetchSinglePayoutsData = async () => {
    if (!payoutId.value) return;

    loadingPayouts.value = true;
    loadingCommission.value = true;

    try {
        const response = await rewardfulService.getPayouts({ payoutId: payoutId.value });
        console.log("Payout Details:", response.data);

        payoutsData.value = response?.data;
        console.log("Updated Payouts Data:", payoutsData.value);
        fetchSingleCommissionData();
    } catch (error) {
        console.error("Error fetching payout data:", error);
        payoutsData.value = [];
    } finally {
        loadingPayouts.value = false;
    }
};

const fetchSingleCommissionData = async () => {
    if (!payoutsData.value || !payoutsData.value.commissions || payoutsData.value.commissions.length === 0) return;
    try {
        const responses = await Promise.all(
            payoutsData.value.commissions.map(async (commission) => {
                const response = await rewardfulService.getCommissions({ commissionId: commission.id });
                return response?.data;
            })
        );

        commissionsData.value = responses;
    } catch (error) {
        console.error("Error fetching commissions:", error);
        commissionsData.value = [];
    } finally {
        loadingCommission.value = false;
    }
};

onMounted(fetchSinglePayoutsData);

watchEffect(() => {
    console.log("Payout ID:", payoutId.value);
    console.log("commissionsData :", commissionsData.value);
});

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '--';
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

</script>