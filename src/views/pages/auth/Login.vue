<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useRouter, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { AuthService } from "../../../service/AuthService.js";
import { formValidation, showToast } from "../../../utils/Helper.js";
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/store/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const registerPageUrl = import.meta.env.VITE_REGISTER_PAGE_URL;

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false); // 🔄 loader flag

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
  const fromValues = {
    email: email.value,
    password: password.value,
  };

  const validation = formValidation(fromValues);
  if (validation !== true) {
    showToast(toast, "error", "Error", validation);
    email.value = "";
    password.value = "";
    return;
  }

  isLoading.value = true;
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
    <div class="section-gradient">
      <img src="../../../assets/Images/logo.webp" alt="logo" class="w-[150px]"/>
    </div>
  <div
    class="bg-surface-50 dark:bg-surface-950 flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">  
    <div class="w-full max-w-3xl">
      <div class="rounded-[56px] p-[0.3rem] w-full"
        style="background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="bg-surface-0 dark:bg-surface-900 rounded-[53px] py-12 px-6 sm:px-12 md:px-20">
          <div class="text-center mb-8">
            <h1 class="text-muted-color font-medium text-2xl sm:text-3xl">Welcome Back! Please log in to access your
              affiliate portal.</h1>
          </div>
          <div class="text-center mb-8">
            <h1 class="text-muted-color font-medium text-2xl sm:text-3xl">Sign In</h1>
          </div>

          <!-- Toast -->
          <Toast />

          <!-- Form -->
          <div>
            <!-- Email -->
            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-base sm:text-lg font-medium mb-2">
              Email
            </label>
            <InputText
              id="email1"
              v-model="email"
              type="text"
              placeholder="Email address"
              class="w-full mb-6"
            />

            <!-- Password -->
            <label for="password1" class="block text-surface-900 dark:text-surface-0 text-base sm:text-lg font-medium mb-2">
              Password
            </label>
            <Password
              id="password1"
              v-model="password"
              placeholder="Password"
              :toggleMask="true"
              class="w-full mb-4"
              fluid
              :feedback="false"
            />

            <!-- Forgot Password -->
            <div class="flex justify-end mt-2 mb-6">
              <span class="font-medium text-sm sm:text-base text-primary cursor-pointer" @click="forgetpassword">
                Forgot password?
              </span>
            </div>

            <!-- Sign In Button -->
            <Button
              type="button"
              :label="isLoading ? 'Signing In...' : 'Sign In'"
              @click="loginHandler"
              :disabled="isLoading"
              class="w-full flex justify-center items-center gap-2"
            >
              <i v-if="isLoading" class="pi pi-spinner pi-spin"></i>
            </Button>

            <!-- Google Sign-In -->
            <Button
              label="Sign in with Google"
              icon="pi pi-google"
              class="w-full mt-4 bg-white text-black border border-gray-300 hover:bg-gray-100"
              @click="googleSignIn"
            />

            <!-- Register CTA -->
            <div class="text-center mt-8">
              <span class="font-medium text-sm sm:text-base text-primary cursor-pointer" @click="registerPage">
                Don’t have an account? Create your account now!
              </span>
            </div>
          </div>

          <div class="text-center">Property Pros Marketing | Affiliate Access</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye,
.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}

.section-gradient {
  width: 100%;
  background: linear-gradient(180deg, #395E70, #17242D);
}
</style>
