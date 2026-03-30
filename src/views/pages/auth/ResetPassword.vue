<template>
    <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient">
        <div class="flex justify-center w-full">
            <img src="../../../assets/Images/logo-2.png" alt="logo" class="w-[250px]" />
        </div>
        <div class="w-full max-w-3xl">
            <div class="rounded-[56px] p-[0.3rem] w-full">
                <div class="bg-surface-0 dark:bg-surface-900 rounded-xl py-12 px-6 sm:px-12 md:px-20 shadow-md">
                    <div class="text-center mb-4">
                        <h2 class="font-medium text-2xl text-theme-color">Reset Password</h2>
                        <h1 class="font-medium text-1xl sm:text-1xl text-theme-color">Create a new secure password to
                            access your account.</h1>
                    </div>
                    <Toast />
                    <label for="password"
                        class="block text-surface-900 dark:text-surface-0 text-base font-medium mb-2 text-theme-color">
                        New Password
                    </label>
                    <Password id="password" v-model="password" placeholder="Enter New Password" :toggleMask="true"
                        class="w-full mb-4 field" fluid :feedback="false" />
                    <label for="confirmPassword"
                        class="block text-surface-900 dark:text-surface-0 text-base font-medium mb-2 text-theme-color">
                        Confirm Password
                    </label>
                    <Password id="confirmPassword" v-model="confirmPassword" placeholder="Confirm Password"
                        :toggleMask="true" class="w-full mb-4 field" fluid :feedback="false" />
                    <Button type="button" :disabled="isLoading" @click="resetPassword"
                        class="w-full flex justify-center items-center gap-2 text-white brand-button font-medium relative">
                        <i v-if="isLoading" class="pi pi-spinner pi-spin text-white"></i>
                        <span class="ml-2">
                            Reset Password
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { showToast, validateModernPassword } from '@/utils/Helper';
import { AuthService } from '@/service/AuthService';

const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const toast = useToast();
const token = route.query.token;

const resetPassword = async () => {
    isLoading.value = true;
    if (!formValidation()) {
        isLoading.value = false;
        return false
    };

    try {
        let payload = {
            newPassword: password.value,
            token: token
        };
        const response = await AuthService.resetPassword(payload);
        console.log(response)
        if (!response.error) {
            showToast(toast, "success", "Success", response.message);
            setTimeout(() => {
                router.push({ name: 'login' });
            }, 2000);
        } else {
            showToast(toast, "error", "Error", response.error);
        }
    } catch (error) {
        showToast(toast, "error", 'Error', 'An error occurred while resetting password');
    } finally {
        isLoading.value = false;
    }
};

const formValidation = () => {
    password.value = password.value.trim();
    const passwordValidation = validateModernPassword(password.value);
    if (passwordValidation !== true) {
        showToast(toast, "error", "Error", passwordValidation);
        return false;
    }

    confirmPassword.value = confirmPassword.value.trim();
    if (confirmPassword.value === '') {
        showToast(toast, "error", "Error", "Please confirm your password");
        return false;
    }

    if (password.value !== confirmPassword.value) {
        showToast(toast, "error", "Error", "Passwords do not match");
        return false;
    }

    return true;
};
</script>

<style scoped>
.field :deep(.p-inputtext:focus) {
    border-color: var(--accent-start) !important;
}
</style>
