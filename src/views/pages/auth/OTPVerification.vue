<template>
    <FloatingConfigurator />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div v-if="!isOtpSent"
                style="border-radius: 56px; padding: 0.3rem; width: 100%; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div>
                        <label for="otp"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">OTP</label>
                        <InputText id="otp" type="number" placeholder="Enter OTP" class="w-full md:w-[30rem] mb-2"
                            v-model="otp" />
                        <div class="flex items-center justify-start mt-2 mb-2 gap-8">
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-red-500"
                                v-show="isFieldEmpty">{{ error }}</span>
                        </div>
                        <Button type="button" label="Reset Password" @click="resetPassword"
                            :disabled="isLoading" class="w-full flex justify-center items-center gap-2">
                            <i v-if="isLoading" class="pi pi-spinner pi-spin"></i>
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
const otp = ref('');
const isLoading = ref(false);
const isFieldEmpty = ref(false);
const error = ref();
const isOtpSent = ref(false);
const router = useRouter();
const route = useRoute();
const token = route.query.token;
const resetPassword = async () => {
    isLoading.value = true;
    if (!otp.value) {
        isLoading.value = false;
        isFieldEmpty.value = true;
        error.value = 'Please enter your OTP';
        return;
    }
    isFieldEmpty.value = false;
    // router.push({ name: 'resetPassword', query: { token } });
    // Call the API to reset the password with the OTP
    try {
        let payload = {
            otp: otp.value,
            token: token
        };
        const response = await AuthService.otpVarification(payload);
        if(response){
            router.push({ name: 'resetPassword', query: { token } });
        } else {
            showToast('error', 'Error', 'Failed to reset password');
        }
    } catch (error) {
        showToast('error', 'Error', 'An error occurred while resetting password');
    } finally {
        isLoading.value = false;
    }
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
