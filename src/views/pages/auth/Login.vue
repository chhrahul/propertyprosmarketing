<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { AuthService } from "@/service/AuthService";
import { formValidation, showToast } from "@/utils/Helper";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const registerPageUrl = import.meta.env.VITE_REGISTER_PAGE_URL;

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);

onMounted(() => {
  const error = route.query.error;
  if (error) {
    showToast(toast, "error", "Error", decodeURIComponent(error));
    router.replace({ query: {} });
  }
});

const forgetpassword = () => {
  router.push({ name: 'forgetPassword' });
};

const loginHandler = async () => {
  isLoading.value = true;
  const fromValues = {
    email: email.value,
    password: password.value,
  };

  const validation = formValidation(fromValues);
  if (validation !== true) {
    showToast(toast, "error", "Error", validation);
    email.value = "";
    password.value = "";
    isLoading.value = false;
    return;
  }

  try {
    const loginUserDetails = await AuthService.login(fromValues);
    if (loginUserDetails.error) {
      showToast(toast, "error", "Error", loginUserDetails.error);
      email.value = "";
      password.value = "";
    } else {
      authStore.setUserLoginDetail(loginUserDetails);
      router.push({ name: 'homeDash' });
    }
  } catch (err) {
    showToast(toast, "error", "Error", "An unexpected error occurred.");
  } finally {
    isLoading.value = false;
  }
};

const googleSignIn = () => {
  window.location.href = `${baseURL}auth/google`;
};
const registerPage = () => {
  window.open(registerPageUrl, '_blank');
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient">
    <div class="flex justify-center w-full mb-8">
      <img src="../../../assets/Images/logo.webp" alt="logo" class="w-[170px]" />
    </div>
    <div class="w-full max-w-3xl">
      <div class="rounded-[56px] p-[0.3rem] w-full">
        <div class="bg-surface-0 dark:bg-surface-900 rounded-xl py-12 px-6 sm:px-12 md:px-20 shadow-md">
          <div class="text-center mb-3">
            <h1 class="font-medium text-2xl sm:text-2xl text-theme-color">
              Welcome Back!
            </h1>
            <h1 class="font-medium text-1xl sm:text-1xl text-theme-color">
              Please log in to access your affiliate portal.
            </h1>
          </div>
          <Toast />
          <div>
            <label for="email1" class="block  text-base sm:text-medium font-medium mb-2 text-theme-color ">
              Email
            </label>
            <InputText id="email1" v-model="email" type="text" placeholder="Email" class="w-full mb-4 field" />
            <label for="password1" class="block  text-base sm:text-medium font-medium mb-2 text-theme-color">
              Password
            </label>
            <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full field"
              fluid :feedback="false" />
            <div class="flex justify-end mt-1 mb-5">
              <span class="font-medium text-sm sm:text-base cursor-pointer text-theme-color hover-underline"
                @click="forgetpassword">
                Forgot password?
              </span>
            </div>
            <Button type="button" :disabled="isLoading" @click="loginHandler"
              class="w-full flex justify-center items-center gap-2 text-white brand-button font-medium relative">
              <i v-if="isLoading" class="pi pi-spinner pi-spin text-white"></i>
              <span class="ml-2">
                {{ isLoading ? 'Signing In...' : 'Sign In' }}
              </span>
            </Button>
            <Button label="Sign in with Google" icon="pi pi-google"
              class="google-button w-full mt-4 flex items-center justify-center gap-2" @click="googleSignIn" />
            <div class="text-center mt-8">
              <span class="font-medium text-sm sm:text-base" @click="registerPage">
                <span class="text-black">Don’t have an account? </span><span
                  class="text-theme-color cursor-pointer hover-underline">Sign Up</span>
              </span>
            </div>
          </div>
          <div class="text-center text-sm text-theme-color font-medium">Property Pros Marketing | Affiliate Access</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.google-button {
  background-color: #ffffff;
  color: #333333 !important;
  border: 1px solid #dcdcdc;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.google-button:hover {
  background-color: #f1f1f1 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  cursor: pointer !important;
  border: 1px solid #f1f1f1 !important;
}

.google-button:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.4) !important;
}

.field :deep(.p-inputtext:focus) {
  border-color: var(--accent-start) !important;
}
</style>
