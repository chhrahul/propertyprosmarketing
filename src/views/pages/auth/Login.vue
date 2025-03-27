<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import router from '@/router';
import { ref } from 'vue';
import { AuthService } from "../../../service/AuthService.js"
import {formValidation, showToast} from "../../../utils/Helper.js"

import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore();
const toast = useToast();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const forgetpassword = () => {
    router.push({ name: 'forgetPassword' });
};
const loginHandler = async () => {
    const fromValues = {
        email: email.value,
        password: password.value
    }
    if (formValidation(fromValues) != true) {
        showToast(toast, "error", "Error", formValidation(fromValues));
        email.value = "";
        password.value = "";
        return false;
    }

    // fromValues.rememberMe = rememberMe.value;
    let loginUserDetails = await AuthService.login(fromValues);
    if(loginUserDetails.error){
        showToast(toast, "error", "Error", loginUserDetails.error);
        email.value = "";
        password.value = "";
        return false;
    }
    authStore.setUserLoginDetail(loginUserDetails);
    router.push({ name: 'dashboard' });
}

</script>

<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <h1><span class="text-muted-color font-medium">Sign In</span></h1>
                    </div>
                    <Toast />
                    <div>
                        <label for="email1"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" v-model="email" type="text" placeholder="Email address"
                            class="w-full md:w-[30rem] mb-8" />

                        <label for="password1"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                            class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="rememberMe" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary"
                                @click="forgetpassword">Forgot password?</span>
                        </div>
                        <Button type="button" label="Sign In" @click="loginHandler" class="w-full" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

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
