<template>
    <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">Referrals</h2>

        <ul class="flex border-b mb-4">
            <li class="mr-4">
                <a href="#" @click="activeTab = 'leads'"
                    :class="activeTab === 'leads' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'"
                    class="py-3 px-4 inline-block border-b-2 hover:border-blue-500">
                    Leads <span class="ml-1 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">{{ leads.length
                        }}</span>
                </a>
            </li>
            <li>
                <a href="#" @click="activeTab = 'conversions'"
                    :class="activeTab === 'conversions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'"
                    class="py-3 px-4 inline-block border-b-2 hover:border-blue-500">
                    Conversions <span class="ml-1 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">{{
                        conversions.length }}</span>
                </a>
            </li>
        </ul>

        <div class="overflow-x-auto">
            <table class="w-full border rounded-lg">
                <thead class="bg-gray-100 text-gray-700">
                    <tr>
                        <th class="p-4 text-left">Link</th>
                        <th class="p-4 text-center">First click</th>
                        <th class="p-4 text-center">Became lead</th>
                        <th v-if="activeTab === 'conversions'" class="p-4 text-center">Converted</th>
                        <th v-if="activeTab === 'conversions'" class="p-4 text-left">Subscription</th>
                        <th v-if="activeTab === 'leads'" class="p-4 text-center">Customer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredReferrals.length === 0">
                        <td colspan="5" class="py-4 text-center text-gray-500">
                            <p class="text-lg">Sorry, your query returned no results.</p>
                            <p class="text-sm text-gray-400">Try searching again with different terms.</p>
                        </td>
                    </tr>
                    <tr v-for="referral in filteredReferrals" :key="referral.id">
                        <td class="p-4 text-left">
                            <a :href="referral.link.url" class="text-blue-500 hover:underline">{{ referral.link.url
                                }}</a>
                        </td>
                        <td class="p-4 text-center">{{ formatDate(referral.created_at) }}</td>
                        <td class="p-4 text-center">{{ formatDate(referral.became_lead_at) || 'N/A' }}</td>
                        <td v-if="activeTab === 'conversions'" class="p-4 text-center">{{
                            formatDate(referral.became_conversion_at) || 'N/A' }}</td>
                        <td v-if="activeTab === 'conversions'" class="p-4 text-left">{{ referral.conversion_state
                            }}</td>
                        <td v-if="activeTab === 'leads'" class="p-4 text-center">{{ referral.customer || 'N/A' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeTab: 'leads',
            referrals: [
                {
                    "id": "5817af5c-1e3b-49a2-bb32-4f07c7e518c9",
                    "created_at": "2025-03-17T13:07:59.390Z",
                    "became_lead_at": "2025-03-18T10:00:00.000Z",
                    "became_conversion_at": null,
                    "conversion_state": "visitor",
                    "customer": "John Doe",
                    "link": {
                        "url": "https://propertyprosmarketing.com/?via=rahul-chhabra"
                    }
                },
                {
                    "id": "5c8189c6-25b6-4069-aca8-209c80cdbfc1",
                    "created_at": "2025-03-17T13:07:41.165Z",
                    "became_lead_at": "2025-03-19T09:15:00.000Z",
                    "became_conversion_at": null,
                    "conversion_state": "visitor",
                    "customer": null,
                    "link": {
                        "url": "https://propertyprosmarketing.com/?via=rahul-chhabra"
                    }
                },
                {
                    "id": "ead01bf5-82eb-4e6d-baf6-39237b89420a",
                    "created_at": "2025-03-12T13:29:35.806Z",
                    "became_lead_at": "2025-03-14T08:45:00.000Z",
                    "became_conversion_at": "2025-03-16T12:30:00.000Z",
                    "conversion_state": "subscriber",
                    "customer": "Jane Smith",
                    "link": {
                        "url": "https://propertyprosmarketing.com/?via=rahul-chhabra"
                    }
                }
            ]
        };
    },
    computed: {
        leads() {
            return this.referrals.filter(referral => referral.became_lead_at && !referral.became_conversion_at);
        },
        conversions() {
            return this.referrals.filter(referral => referral.became_conversion_at);
        },
        filteredReferrals() {
            return this.activeTab === 'leads' ? this.leads : this.conversions;
        }
    },
    methods: {
        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString();
        }
    }
};
</script>