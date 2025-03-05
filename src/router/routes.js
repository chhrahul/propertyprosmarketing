import AppLayout from '@/layout/AppLayout.vue';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/pages/auth/Login.vue';
import promotersList from '@/views/promotersList.vue';
import myCampaign from '@/views/myCampaign.vue';
import ForgetPassword from '@/views/pages/auth/ForgetPassword.vue';
const routes = [
    {
        path: '/',
        name: 'login',
        beforeEnter: (to, from, next) => {
            const isAuthenticated = localStorage.getItem('token')
            if (isAuthenticated) {
                next('/dashboard')
            } else {
                next()
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
            const isAuthenticated = localStorage.getItem('token')
            if (!isAuthenticated) {
                next('/')
            } else {
                next()
            }
        },
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: Dashboard
            },
        ]
    },
    {
        path: '/promoters',
        component: AppLayout,
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token'); // Check if user is authenticated
            const auth = JSON.parse(localStorage.getItem('auth'));
    
            if (!token) {
                next('/');
            } else if (!auth.user.user || auth.user.user.role !== 'admin') {
                next('/unauthorized');
            } else {
                next(); 
            }
        },
        children: [
            {
                path: '/promoters',
                name: 'Promoters',
                component: promotersList
            },
        ]
    },
    ,
    {
        path: '/my-campaigns',
        component: AppLayout,
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token'); // Check if user is authenticated
            const auth = JSON.parse(localStorage.getItem('auth'));
    
            if (!token) {
                next('/');
            } else if (!auth.user.user || auth.user.user.role !== 'user') {
                next('/unauthorized');
            } else {
                next(); 
            }
        },
        children: [
            {
                path: '/my-campaigns',
                name: 'my-campaigns',
                component: myCampaign
            },
        ]
    }
];

export default routes;