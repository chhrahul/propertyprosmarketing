<template>
    <div class="col-span-12">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Overview</div>
        </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3" v-for="(item, index) in dashboardData" :key="index">
        <div class="card mb-0 p-4 shadow-lg rounded-lg bg-white dark:bg-gray-800">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-gray-500 dark:text-gray-400 font-medium mb-2">{{ item.label }}</span>
                    <div class="text-gray-900 dark:text-white font-medium text-xl">
                        {{ item.value }}
                    </div>
                </div>
                <div :class="item.iconBg" class="flex items-center justify-center rounded-full"
                    style="width: 2.5rem; height: 2.5rem">
                    <i :class="item.iconClass"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ item.subText }}</span>
            <span class="text-gray-500 dark:text-gray-400 ml-1">{{ item.subLabel }}</span>
        </div>
    </div>
</template>

<script>
import { fetchDashboardData } from '@/service/firstPromoterService';
import { AuthService } from "../../service/authService";

export default {
    data() {
        return {
            dashboardData: [
                { label: 'Total Clicks', value: 0, iconClass: 'pi pi-mouse', iconBg: 'bg-blue-100 dark:bg-blue-400/10' },
                { label: 'Total Leads', value: 0, iconClass: 'pi pi-user-plus', iconBg: 'bg-orange-100 dark:bg-orange-400/10' },
                { label: 'Total Conversions', value: 0, iconClass: 'pi pi-check', iconBg: 'bg-cyan-100 dark:bg-cyan-400/10' },
                { label: 'Total Earnings (Cash)', value: '$0', iconClass: 'pi pi-dollar', iconBg: 'bg-green-100 dark:bg-green-400/10' },
                { label: 'Total Earnings (Credits)', value: '0', iconClass: 'pi pi-credit-card', iconBg: 'bg-yellow-100 dark:bg-yellow-400/10' },
                { label: 'Pending Payouts (Cash)', value: '$0', iconClass: 'pi pi-hourglass', iconBg: 'bg-purple-100 dark:bg-purple-400/10' },
                { label: 'Pending Payouts (Credits)', value: '0', iconClass: 'pi pi-clock', iconBg: 'bg-pink-100 dark:bg-pink-400/10' },
                { label: 'Approved Payouts (Cash)', value: '$0', iconClass: 'pi pi-wallet', iconBg: 'bg-gray-100 dark:bg-gray-400/10' },
                { label: 'Approved Payouts (Credits)', value: '0', iconClass: 'pi pi-star', iconBg: 'bg-indigo-100 dark:bg-indigo-400/10' }
            ]
        };
    },
    async mounted() {
        const token = localStorage.getItem('token');
        const userpromoter = await AuthService.getUserMeta(token);
        const data = await fetchDashboardData(userpromoter.userpromoterId);
        if (data) {
            this.dashboardData[0].value = data.clicks;
            this.dashboardData[1].value = data.leads;
            this.dashboardData[2].value = data.conversions;
            this.dashboardData[3].value = data.earningsCash;
            this.dashboardData[4].value = data.earningsCredits;
            this.dashboardData[5].value = data.pendingCash;
            this.dashboardData[6].value = data.pendingCredits;
            this.dashboardData[7].value = data.approvedCash;
            this.dashboardData[8].value = data.approvedCredits;
        }
    }
};
</script>