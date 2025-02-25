import AppLayout from '@/layout/AppLayout.vue';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/pages/auth/Login.vue';
import ForgetPassword from '@/views/pages/auth/ForgetPassword.vue';
const routes = [
    {
        path: '/',
        name: 'login',
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
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: Dashboard
            },
        ]
    },
];

export default routes;