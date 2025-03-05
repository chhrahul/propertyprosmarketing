import AppLayout from '@/layout/AppLayout.vue';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/pages/auth/Login.vue';
import promotersList from '@/views/promotersList.vue';
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
            const isAuthenticated = localStorage.getItem('token')
            if (!isAuthenticated) {
                next('/')
            } else {
                next()
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
];

export default routes;