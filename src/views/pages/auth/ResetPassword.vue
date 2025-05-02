<template>
    <FloatingConfigurator />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div v-if="!isOtpSent"
                style="border-radius: 56px; padding: 0.3rem; width: 100%; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div>
                        <Toast />
                        <label for="password"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Password</label>
                        <InputText id="password" type="text" placeholder="Enter Password"
                            class="w-full md:w-[30rem] mb-2" v-model="password" />

                        <label for="confirmPassword"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Confirm
                            Password</label>
                        <InputText id="confirmPassword" type="text" placeholder="Enter Confirm Password"
                            class="w-full md:w-[30rem] mb-2" v-model="confirmPassword" />
                        <div class="flex items-center justify-start mt-2 mb-2 gap-8">
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-red-500"
                                v-show="isFieldEmpty">{{ error }}</span>
                        </div>
                        <Button type="button" label="Reset Password" @click="resetPassword" 
                            class="w-full flex justify-center items-center gap-2">
                            <!-- <i v-if="isLoading" class="pi pi-spinner pi-spin"></i> -->
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AuthService } from '@/service/AuthService';
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const isFieldEmpty = ref(false);
const error = ref();
const isOtpSent = ref(false);
const route = useRoute();
const token = route.query.token;
const router = useRouter();
import { useToast } from 'primevue/usetoast';
import { showToast } from '@/utils/Helper';

const toast = useToast();

const resetPassword = async () => {
    isLoading.value = true;
    if(!formValidation()){
        return false
    };
    isFieldEmpty.value = false;
    // Call the API to reset the password with the OTP
    try {
        let payload = {
            newPassword: password.value,
            token: token
        };
        const response = await AuthService.resetPassword(payload);
        console.log(response)
        if(!response.error){
            showToast(toast, "success", "Success", response.message);
            setTimeout(() => {
                router.push({ name: 'login'});
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
    if (password.value === '') {
        isFieldEmpty.value = true;
        showToast(toast, "error", "Error", "Please enter your password");
        return false;
    }

    confirmPassword.value = confirmPassword.value.trim();
    if (confirmPassword.value === '') {
        isFieldEmpty.value = true;
        showToast(toast, "error", "Error", "Please confirm your password");
        return false;
    }

    if (password.value !== confirmPassword.value) {
        showToast(toast, "error", "Error", "Passwords do not match");
        return false;
    }

    isFieldEmpty.value = false;
    return true;
};


</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
