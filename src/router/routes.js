import AppLayout from '@/layout/AppLayout.vue';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/pages/auth/Login.vue';
import PromotersList from '@/views/PromotersList.vue';
import Campaign from '@/views/Campaign.vue';
import CampaignDetails from '@/views/CampaignDetails.vue';
import ForgetPassword from '@/views/pages/auth/ForgetPassword.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        beforeEnter: (to, from, next) => {
            const isAuthenticated = localStorage.getItem('token');
            if (isAuthenticated) {
                next('/dashboard');
            } else {
                next();
            }
        },
        component: Login
    },
    {
        path: '/auth/forgetpassword',
        name: 'forgetPassword',
        component: ForgetPassword
    },
    {
        path: '/dashboard',
        component: AppLayout,
        beforeEnter: (to, from, next) => {
            const isAuthenticated = localStorage.getItem('token');
            if (!isAuthenticated) {
                next('/');
            } else {
                next();
            }
        },
        children: [
            {
                path: '', // Empty because it's the default child route
                name: 'dashboard',
                component: Dashboard
            },
            {
                path: '/campaigns',
                name: 'Campaigns',
                component: Campaign
            },
            {
                path: '/campaign/details/:id',
                name: 'CampaignDetails',
                component: CampaignDetails
            }
        ]
    },
    // {
    //     path: '/promoters',
    //     component: AppLayout,
    //     beforeEnter: (to, from, next) => {
    //         const token = localStorage.getItem('token');
    //         const auth = JSON.parse(localStorage.getItem('auth'));

    //         if (!token) {
    //             next('/');
    //         } else if (!auth?.user?.user || auth.user.user.role !== 'admin') {
    //             next('/unauthorized');
    //         } else {
    //             next();
    //         }
    //     },
    //     children: [
    //         {
    //             path: '', // Empty because it's the default child route
    //             name: 'Promoters',
    //             component: PromotersList
    //         }
    //     ]
    // },
    // {
    //     path: '/campaigns',
    //     component: AppLayout,
    //     beforeEnter: (to, from, next) => {
    //         const token = localStorage.getItem('token');
    //         const auth = JSON.parse(localStorage.getItem('auth'));

    //         if (!token) {
    //             next('/');
    //         } else if (!auth?.user?.user || auth.user.user.role !== 'user') {
    //             next('/unauthorized');
    //         } else {
    //             next();
    //         }
    //     },
    //     children: [
    //         {
    //             path: '', // Default route for /campaigns
    //             name: 'Campaigns',
    //             component: Campaign
    //         },
    //         {
    //             path: 'campaign-details/:id', // Child route inside /campaigns
    //             name: 'CampaignDetails',
    //             component: CampaignDetails
    //         }
    //     ]
    // }
];

export default routes;