import { createRouter, createWebHistory } from 'vue-router'
import AjoutView from '../views/AjoutView.vue'
import ListeView from '../views/ListeView.vue'
import BilanView from '../views/BilanView.vue'
import LoginView from '../views/LoginView.vue'

const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true'
}

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        redirect: '/ajout'
    },
    {
        path: '/ajout',
        name: 'Ajout',
        component: AjoutView,
        meta: { requiresAuth: true }
    },
    {
        path: '/liste',
        name: 'Liste',
        component: ListeView,
        meta: { requiresAuth: true }
    },
    {
        path: '/bilan',
        name: 'Bilan',
        component: BilanView,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/login')
    } else if (to.path === '/login' && isAuthenticated()) {
        next('/ajout')
    } else {
        next()
    }
})

export default router