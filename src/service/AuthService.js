import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;
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
    getUserMeta: async (token) => {
        let endpoint = `${baseURL}auth/get-user-meta?key=promoterId`;
        let user = await axios.get(endpoint, {
            headers: {
                "Authorization": "Bearer " + token,
            },
        });
        return {
            userpromoterId: user.data.value,
        }
    },
};

