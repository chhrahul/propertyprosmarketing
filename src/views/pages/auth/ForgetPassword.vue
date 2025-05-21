<template>
    <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient">
        <div class="flex justify-center w-full mb-8">
            <img src="../../../assets/Images/logo.webp" alt="logo" class="w-[170px]" />
        </div>

        <div class="w-full max-w-3xl">
            <div class="rounded-[56px] p-[0.3rem] w-full">
                <div class="bg-surface-0 dark:bg-surface-900 rounded-xl py-12 px-6 sm:px-12 md:px-20 shadow-md">
                    <div class="text-center mb-3">
                        <h2 class="font-medium text-2xl sm:text-2xl text-theme-color">Forgot Password</h2>
                        <h1 class="font-medium text-1xl sm:text-1xl text-theme-color">
                            Enter your registered email to receive a password reset link.
                        </h1>
                    </div>
                    <Toast />
                    <label for="email1"
                        class="block text-surface-900 dark:text-surface-0 text-base sm:text-medium font-medium mb-2 text-theme-color">
                        Email
                    </label>
                    <InputText id="email1" type="text" placeholder="Email" class="w-full mb-4 field" v-model="email" />
                    <div class="text-left mb-4" v-show="isOtpSent">
                        <span class="text-green-500 font-medium">{{ showMessage }}</span>
                    </div>
                    <Button type="button" :disabled="isLoading" @click="forgetPassword"
                        class="w-full flex justify-center items-center gap-2 text-white brand-button font-medium relative">
                        <i v-if="isLoading" class="pi pi-spinner pi-spin text-white"></i>
                        <span class="ml-2">
                            Send OTP
                        </span>
                    </Button>
                    <div class="text-center mt-6">
                        <span @click="router.push({ name: 'login' })"
                            class="text-sm text-theme-color font-medium cursor-pointer  flex items-center justify-center gap-1">
                            <i class="pi pi-arrow-left text-sm"></i>
                            <span class="hover-underline">Back to Login</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { showToast } from '@/utils/Helper'
import { AuthService } from '@/service/AuthService';

const email = ref('');
const isLoading = ref(false);
const router = useRouter();
const toast = useToast();
const isOtpSent = ref(false);
const showMessage = ref('Please check your email for the OTP');

const forgetPassword = async () => {
    isLoading.value = true;
    if (!email.value) {
        isLoading.value = false;
        showToast(toast, 'error', 'Error', 'Please enter your email address');
        return;
    }
    try {
        const response = await AuthService.forgetPassword({ email: email.value });
        if (!response.error) {
            showToast(toast, "success", "Success", showMessage);
            setTimeout(() => {
                router.push({ name: 'otpVerification', query: { token: response.token } });
            }, 2000);
        } else {
            showToast(toast, 'error', 'Error', response.error);
        }
    } catch (error) {
        showToast(toast, 'error', 'Error', error.response.data.message);

    } finally {
        isLoading.value = false;
    }
};

</script>

<style scoped>
.hover-underline:hover {
    text-decoration: underline;
}

.field:focus {
    border-color: #cbd5e1 !important;
}
</style>
