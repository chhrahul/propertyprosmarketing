<template>
    <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient">
        <div class="flex justify-center w-full mb-8">
            <img src="../../../assets/Images/logo.webp" alt="logo" class="w-[170px]" />
        </div>

        <div class="w-full max-w-3xl">
            <div class="rounded-[56px] p-[0.3rem] w-full">
                <div class="bg-surface-0 dark:bg-surface-900 rounded-xl py-12 px-6 sm:px-12 md:px-20 shadow-md">
                    <div class="text-center mb-4">
                        <h2 class="font-medium text-2xl text-theme-color">OTP Verification</h2>
                        <h1 class="font-medium text-1xl sm:text-1xl text-theme-color">
                            Enter the 6-digit code sent to your email.</h1>
                    </div>
                    <Toast />
                    <div class="otp-container mb-6">
                        <input v-for="(digit, index) in otpArray" :key="index" type="password" maxlength="1"
                            class="otp-input" v-model="otpArray[index]" @input="handleInput(index)"
                            @keydown="handleKeydown($event, index)" @paste="handlePaste($event)" ref="otpInputs" />
                    </div>
                    <Button type="button" :disabled="isLoading" @click="submitOtp"
                        class="w-full flex justify-center items-center gap-2 text-white brand-button font-medium relative">
                        <i v-if="isLoading" class="pi pi-spinner pi-spin text-white"></i>
                        <span class="ml-2">
                            Verify OTP
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { showToast } from '@/utils/Helper';
import { AuthService } from '@/service/AuthService';

const toast = useToast();
const otpArray = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const token = route.query.token;

const handleInput = (index) => {
    const input = otpArray.value[index];

    if (/\D/.test(input)) {
        otpArray.value[index] = '';
        return;
    }

    if (input.length === 1 && index < otpInputs.value.length - 1) {
        otpInputs.value[index + 1].focus();
    }
};

const handleKeydown = (event, index) => {
    if (event.key === 'Backspace' && otpArray.value[index] === '' && index > 0) {
        otpInputs.value[index - 1].focus();
    }
};

const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 0) return;

    for (let i = 0; i < pasteData.length; i++) {
        otpArray.value[i] = pasteData[i];
    }

    const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
    otpInputs.value[nextIndex].focus();
};

const submitOtp = async () => {
    isLoading.value = true;
    const otp = otpArray.value.join('');
    if (otp.length !== 6) {
        showToast(toast, "error", "Error", 'Please enter a valid 6-digit OTP');
        isLoading.value = false;
        return;
    }
    try {
        const payload = { otp, token };
        const response = await AuthService.otpVarification(payload);
        console.log(response)
        if (!response.error) {
            router.push({ name: 'resetPassword', query: { token } });
        } else {
            showToast(toast, "error", "Error", response.error);
        }
    } catch (err) {
        showToast(toast, "error", "Error", err);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    if (otpInputs.value.length > 0) {
        otpInputs.value[0].focus();
    }
});
</script>

<style scoped>
.otp-container {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.otp-input {
    width: 40px;
    height: 50px;
    font-size: 24px;
    text-align: center;
    border: 2px solid #ccc;
    border-radius: 5px;
    -webkit-text-security: disc;
}

.otp-input:focus {
    border-color: var(--accent-start);
    outline: none;
}
</style>