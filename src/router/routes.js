import AppLayout from '@/layout/AppLayout.vue';
import Login from '@/views/pages/auth/Login.vue';
import ForgetPassword from '@/views/pages/auth/ForgetPassword.vue';
import homeDash from '@/views/homeDash.vue';
import commissionNew from '@/views/commissionNew.vue';
import referrals from '@/views/referrals.vue';
import payouts from '@/views/payouts.vue';
import profile from '@/views/profile.vue';
import adminDash from '@/views/adminDash.vue';
import PayoutDetails from '@/views/payoutDetails.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
        beforeEnter: (to, from, next) => {
            const isAuthenticated = localStorage.getItem('token');
            if (isAuthenticated) {
                next('/dashboard');  // Redirect to /dashboard if authenticated
            } else {
                next();
            }
        }
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
                next('/');  // Redirect to login if not authenticated
            } else {
                next();
            }
        },
        children: [
            {
                path: '',
                name: 'homeDash',  // Default child route for /dashboard
                component: homeDash
            },
            {
                path: 'commission',
                name: 'commission',
                component: commissionNew
            },
            {
                path: 'referrals',
                name: 'referrals',
                component: referrals
            },
            {
                path: 'payouts',
                name: 'payouts',
                component: payouts
            },
            {
                path: 'profile',
                name: 'profile',
                component: profile
            },
            {
                path: 'adminDash',
                name: 'adminDash',
                component: adminDash
            },
            {
                path: 'PayoutDetails/:id',
                name: 'PayoutDetails',
                component: PayoutDetails
            }
        ]
    }
];

export default routes;
