import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;
export const AuthService = {
    login: async (formValues) => {
        let endpoint = `${baseURL}users`;
        let user = await axios.get(endpoint);
        user = user.data.filter((val) => {
            if(val.email == formValues.email && val.password == formValues.password){
                return val;
            }
        });
        return user;
    },
};
