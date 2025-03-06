import axios from 'axios';
import HTTP from '@/axios';
const API_KEY = import.meta.env.VITE_PROMOTER_API_KEY;
console.log(API_KEY, 'firstpromoter');
export async function fetchDashboardData(userpromoterId) {
    try {
        const response = await axios.get(`https://firstpromoter.com/api/v1/promoters/show?id=${userpromoterId}`, {
            headers: { 'X-API-KEY': API_KEY }
        });
        const data = response.data;
        // const defaultPromotion = data.promotions.find(promo => promo.id === data.default_promotion_id);
        return data.promotions;
        return {
            clicks: defaultPromotion?.visitors_count ?? 0,
            leads: defaultPromotion?.leads_count ?? 0,
            conversions: defaultPromotion?.sales_count ?? 0,
            earningsCash: `$${data.earnings_balance?.cash ?? 0}`,
            earningsCredits: `${data.earnings_balance?.credits ?? 0}`,
            pendingCash: `$${data.current_balance?.cash ?? 0}`,
            pendingCredits: `${data.current_balance?.credits ?? 0}`,
            approvedCash: `$${data.paid_balance?.cash ?? 0}`,
            approvedCredits: `${data.paid_balance?.credits ?? 0}`
        };
    } catch (error) {
        console.error('Error fetching FirstPromoter data:', error);
        return null;
    }
}