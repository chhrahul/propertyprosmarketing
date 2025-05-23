<template>
  <div class="bg-white p-6 shadow-lg rounded-lg">
    <div class="flex items-center justify-between mb-6 border-b pb-4">
      <h5 class="text-2xl font-medium mb-4">
        <i class="pi pi-user user-icon"></i> Profile
      </h5>
      <button type="button" @click="goBack"
        class="btn flex items-center gap-2 text-white font-medium rounded-lg text-sm">
        <i class="pi pi-chevron-left text-base"></i>
        <span>Back</span>
      </button>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <svg aria-hidden="true" class="inline w-20 h-20 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101"
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908..."
          fill="currentColor" />
      </svg>
    </div>

    <!-- Profile Form -->
    <form v-else @submit.prevent="handleSubmit">
      <div class="mb-5">
        <label for="first-name" class="block text-base sm:text-medium font-medium mb-2 text-theme-color">First
          Name</label>
        <input type="text" id="first-name" v-model="affiliateData.first_name" @input="onlyLetters('first_name')"
          class="text-field shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
          required />
      </div>
      <div class="mb-5">
        <label for="last-name" class="block text-base sm:text-medium font-medium mb-2 text-theme-color">Last
          Name</label>
        <input type="text" id="last-name" v-model="affiliateData.last_name" @input="onlyLetters('last_name')"
          class="text-field shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
          required />
      </div>
      <div class="mb-5">
        <label for="email" class="block text-base sm:text-medium font-medium mb-2 text-theme-color">Email</label>
        <input type="email" id="email" v-model="affiliateData.email" disabled
          class="text-field shadow-sm bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-3 cursor-not-allowed" />
      </div>
      <div class="mb-5">
        <label for="paypal_email" class="block text-base sm:text-medium font-medium mb-2 text-theme-color">PayPal
          Email</label>
        <input type="email" id="paypal_email" v-model="affiliateData.paypal_email"
          class="text-field shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
          required />
      </div>
      <button type="submit" class="btn text-white font-medium rounded-lg text-sm">Save</button>
    </form>

    <!-- Change Password Section -->
    <div class="mt-8 border-t pt-6">
      <h5 class="text-2xl font-medium mb-4">Change Password</h5>
      <form @submit.prevent="handlePasswordChange">
        <div class="mb-5">
          <label for="current-password"
            class="block  text-base sm:text-medium font-medium mb-2 text-theme-color">Current Password</label>
          <input type="password" id="current-password" v-model="passwordData.current"
            class="text-field shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-3"
            required />
        </div>
        <div class="mb-5">
          <label for="new-password" class="block  text-base sm:text-medium font-medium mb-2 text-theme-color">New
            Password</label>
          <input type="password" id="new-password" v-model="passwordData.new"
            class="text-field shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
            required />
        </div>
        <div class="mb-5">
          <label for="confirm-password"
            class="block  text-base sm:text-medium font-medium mb-2 text-theme-color">Confirm New
            Password</label>
          <input type="password" id="confirm-password" v-model="passwordData.confirm"
            class="text-field shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
            required />
        </div>
        <button type="submit" class="btn change-password-btn">Change
          Password</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";
import { AuthService } from '@/service/AuthService';
import { rewardfulService } from "@/service/rewardfulService";
import { useToast } from 'primevue/usetoast';
import { showToast } from "../utils/Helper";

const toast = useToast();
const store = useAuthStore();
const { getUser } = storeToRefs(store);
const affiliateData = ref({ first_name: "", last_name: "", email: "" });
const passwordData = ref({ current: "", new: "", confirm: "" });
const isLoading = ref(true);

const onlyLetters = (field) => {
  affiliateData.value[field] = affiliateData.value[field].replace(/[^a-zA-Z\s]/g, '');
};

const fetchAffiliateData = async () => {
  let userId = getUser.value?.user?.id;
  if (!userId) {
    isLoading.value = false;
    return;
  }
  try {
    const affiliateId = await AuthService.getUserMeta(userId, "affiliateId", getUser.value.token);
    if (!affiliateId) {
      isLoading.value = false;
      return;
    }
    const response = await rewardfulService.getAffiliate(affiliateId);
    affiliateData.value = response.data;
  } catch (error) {
    console.error("Error fetching affiliate data:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(affiliateData.value.first_name) || !nameRegex.test(affiliateData.value.last_name)) {
    showToast(toast, "error", "Error", "First and Last names must only contain letters.");
    return;
  }

  try {
    isLoading.value = true;
    const { id, first_name, last_name, paypal_email } = affiliateData.value;
    const response = await rewardfulService.updateAffiliate(id, { first_name, last_name, paypal_email });
    showToast(toast, "success", "Success", "Profile updated successfully!");
  } catch (error) {
    showToast(toast, "error", "Error", "Error updating profile: " + error);
    console.error("Error updating profile:", error);
  } finally {
    isLoading.value = false;
  }
};

const handlePasswordChange = async () => {
  if (passwordData.value.new !== passwordData.value.confirm) {
    showToast(toast, "error", "Error", "Passwords do not match!");
    return;
  }

  let userId = getUser.value?.user?.id;
  if (!userId) {
    showToast(toast, "error", "Error", "User not found!");
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      id: userId,
      "current_password": passwordData.value.current,
      "new_password": passwordData.value.new,
      "confirm_password": passwordData.value.confirm
    };

    const response = await AuthService.changePassword(payload);

    if (response.success) {
      showToast(toast, "success", "Success", response.message);
    } else {
      showToast(toast, "error", "Error", response.error);
    }
    passwordData.value = {
      current: "",
      new: "",
      confirm: ""
    };
  } catch (error) {
    showToast(toast, "error", "Error", "Error changing password: " + error);
    console.error("Error changing password:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchAffiliateData);
const router = useRouter();
const goBack = () => router.back();
</script>

<style scoped>
.text-field {
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem !important;
  background: #f9fbfc !important;
}

.text-field:focus-visible {
  outline: none !important;
  background-color: #fff !important;
}

.user-icon {
  font-size: 1.25rem;
}

.btn {
  background-image: linear-gradient(to right, var(--accent-start), var(--accent-end)) !important;
  color: white;
  border: none !important;
  font-weight: 600;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  padding: 0.6rem 1.25rem;
}

.btn:hover {
  filter: brightness(1.1);
  box-shadow: 1px 2px 10px 2px rgba(0, 0, 0, 0.2);
}

.btn svg {
  color: white;
  stroke: currentColor;
}

.change-password-btn {
  background-image: linear-gradient(to right, #dc2626, #b91c1c) !important;
}

.change-password-btn:hover {
  filter: brightness(1.1);
  box-shadow: 1px 2px 10px 2px rgba(0, 0, 0, 0.2);
}
</style>