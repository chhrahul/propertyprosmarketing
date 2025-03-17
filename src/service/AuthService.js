import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;
import HTTP from "@/axios";
export const AuthService = {
    login: async (payload) => {
        try {
            let endpoint = `${baseURL}auth/login`;
            let response = await axios.post(endpoint, payload);

            return {
                user: response.data.user,
                token: response.data.token,
            };
        } catch (error) {
            return {
                error: error.response?.data?.message || "Login failed. Please try again.",
            };
        }
    },
    getUserMeta: async (userId,key,token) => {
        try {
            let endpoint = `auth/get-user-meta?userId=${userId}&key=${key}`;
            let user = await HTTP.get(endpoint,{
                headers: { Authorization: `Bearer ${token}` }
            });
            return user.data.value;
        } catch (error) {
            localStorage.removeItem('token');
            router.push({ name: 'login' });
            console.log("error : "+error.response?.data?.message);
        }
    },
};
