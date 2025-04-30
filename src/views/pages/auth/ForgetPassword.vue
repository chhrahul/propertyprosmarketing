<template>
    <FloatingConfigurator />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; width: 100%; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div>
                        <label for="email1"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-2"
                            v-model="email" />
                        <div class="flex items-center justify-start mt-2 mb-2 gap-8">
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-red-500"
                                v-show="isFieldEmpty">{{ error }}</span>

                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-green-500"
                                v-show="isOtpSent">{{ showMessage }}</span>
                        </div>
                        <Button type="button" label="Forget Password" @click="forgetPassword"
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
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { AuthService } from '@/service/AuthService';
import { useToast } from 'primevue/usetoast';
import { showToast } from '@/utils/Helper'


const email = ref('');
const isLoading = ref(false);
const isFieldEmpty = ref(false);
const error = ref();
const router = useRouter();
const toast = useToast();
const isOtpSent = ref(false);
const showMessage = ref('Please check your email for the OTP');

const forgetPassword = async () => {
    isLoading.value = true;
    if (!email.value) {
        isLoading.value = false;
        isFieldEmpty.value = true;
        error.value = 'Please enter your email address';
        return;
    }
    isFieldEmpty.value = false;
    try {
        const response = await AuthService.forgetPassword({email: email.value});
        console.log('response', response);
        
        if (response) {
            //showToast(toast, "success", "Success", response.message);
            isOtpSent.value = true;
            setTimeout(() => {
                router.push({ name: 'otpVerification', query: { token: response.token } });
            }, 2000);
        } else {
            showToast('error', 'Error', response.data.message);
        }
    } catch (error) {
        console.error(error);
        showToast('error', 'Error', error.response.data.message);
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
