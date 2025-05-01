<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div v-if="!isOtpSent"
                style="border-radius: 56px; padding: 0.3rem; width: 100%; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="flex flex-col items-center justify-center">
                        <Toast />
                        <label class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-4">Enter
                            OTP</label>
                        <div class="otp-container mb-4">
                            <input v-for="(digit, index) in otpArray" :key="index" type="password" maxlength="1"
                                class="otp-input" v-model="otpArray[index]" @input="handleInput(index)"
                                @keydown="handleKeydown($event, index)" @paste="handlePaste($event)" ref="otpInputs" />
                        </div>
                        <Button type="button" label="Reset Password" @click="submitOtp" :disabled="isLoading"
                            class="w-full flex justify-center items-center gap-2">
                            <i v-if="isLoading" class="pi pi-spinner pi-spin"></i>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AuthService } from '@/service/AuthService';
import { useToast } from 'primevue/usetoast';
import { showToast } from '@/utils/Helper';

const toast = useToast();
const otpArray = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const isLoading = ref(false);
const isFieldEmpty = ref(false);
const error = ref('');
const isOtpSent = ref(false);
const router = useRouter();
const route = useRoute();
const token = route.query.token;

const handleInput = (index) => {
    const input = otpArray.value[index];
    // Ensure only numbers are accepted
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

  // Focus the next empty input (or last one)
  const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
  otpInputs.value[nextIndex].focus();
};

const submitOtp = async () => {
    const otp = otpArray.value.join('');
    if (otp.length !== 6) {
        isFieldEmpty.value = true;
        showToast(toast, "error", "Error", 'Please enter a valid 6-digit OTP');

        return;
    }

    isFieldEmpty.value = false;
    isLoading.value = true;

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

// Focus first input on mount
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
    /* WebKit browsers */
    text-security: disc;
    /* Not widely supported */
}

.otp-input:focus {
    border-color: dodgerblue;
    outline: none;
}
</style>