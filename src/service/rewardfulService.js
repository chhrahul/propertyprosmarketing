import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;


export const rewardfulService = {
    updateAffiliate: async (affiliateId,payload) => {
        try {
            let endpoint = `${baseURL}rewardful/update-affiliate/${affiliateId}`;
            let response = await axios.post(endpoint,payload);
            return response;
        } catch (error) {
            console.error('Error fetching FirstPromoter data:', error);
            return null;
        }
    },
    getAffiliate: async (affiliateId) => {
        try {
            let endpoint = `${baseURL}rewardful/get-affiliate/${affiliateId}`;
            let response = await axios.get(endpoint);
            return response;
        } catch (error) {
            console.error('Error fetching FirstPromoter data:', error);
            return null;
        }
    },
    getCampaign: async (campaignId) => {
        try {
            let endpoint = `${baseURL}rewardful/get-campaign/${campaignId}`;
            let response = await axios.get(endpoint);
            return response;
        } catch (error) {
            console.error('Error fetching FirstPromoter data:', error);
            return null;
        }
    }
};