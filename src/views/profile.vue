<template>
    <div class="bg-white p-6 shadow-lg rounded-lg">
        <div class="flex items-center justify-between mb-6 border-b pb-4">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <i class="pi pi-user"></i> Profile
            </h2>
            <button type="button" @click="goBack" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><i class="pi pi-chevron-left mr-3 cursor-pointer"></i> Back</button>
            
        </div>

        <!-- Loader -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
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

        <!-- Form -->
        <form v-else class="max-w" @submit.prevent="handleSubmit">
            <div class="mb-5">
                <label for="first-name" class="block mb-2 text-sm font-medium text-gray-900">First Name</label>
                <input type="text" id="first-name" v-model="affiliateData.first_name"
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    required />
            </div>
            <div class="mb-5">
                <label for="last-name" class="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
                <input type="text" id="last-name" v-model="affiliateData.last_name"
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    required />
            </div>
            <div class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input type="email" id="email" v-model="affiliateData.email" disabled
                    class="shadow-sm bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-3 cursor-not-allowed"
                    required />
            </div>
            <div class="mb-5">
                <label for="paypal_email" class="block mb-2 text-sm font-medium text-gray-900">Paypal email</label>
                <input type="email" id="paypal_email" v-model="affiliateData.paypal_email"
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    required />
            </div>
            <button type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save
                Changes</button>
        </form>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";
import { AuthService } from '@/service/authService';
import { rewardfulService } from "@/service/rewardfulService";
import { useToast } from 'primevue/usetoast';
import {showToast} from "../utils/Helper"

const toast = useToast();
const store = useAuthStore();
const { getUser } = storeToRefs(store);

const affiliateData = ref({ first_name: "", last_name: "", email: "" });
const isLoading = ref(true); // Loader state

const fetchAffiliateData = async () => {
    let userId = getUser.value?.user?.id;
    if (!userId) {
        isLoading.value = false;
        return;
    }

    try {
        const affiliateId = await AuthService.getUserMeta(userId, "affiliateId",getUser.value.token);
        if (!affiliateId) {
            isLoading.value = false;
            return;
        }

        const response = await rewardfulService.getAffiliate(affiliateId);
        affiliateData.value = response.data;
    } catch (error) {
        console.error("Error fetching affiliate data:", error);
    } finally {
        isLoading.value = false; // Hide loader
    }
};

const handleSubmit = async () => {
    try {
        isLoading.value = true; // Show loader
        const {id,first_name,last_name,paypal_email} = affiliateData.value
        const response = await rewardfulService.updateAffiliate(id,{first_name,last_name,paypal_email});
        console.log("Affiliate data updated:", response);
        showToast(toast, "success", "success", "Profile updated successfully!");
        // alert("Profile updated successfully!");
    } catch (error) {
        showToast(toast, "error", "Error", "Error updating profile:"+ error);
        console.error("Error updating profile:", error);
        // alert("Failed to update profile.");
    } finally {
        isLoading.value = false; // Hide loader
    }
};

onMounted(fetchAffiliateData);

const router = useRouter();
const goBack = () => router.back();
</script>