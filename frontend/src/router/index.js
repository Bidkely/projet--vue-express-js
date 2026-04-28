import { createRouter, createWebHistory } from 'vue-router'
import AjoutView from '../views/AjoutView.vue'
import ListeView from '../views/ListeView.vue'
import BilanView from '../views/BilanView.vue'

const routes = [
  {
    path: '/',
    redirect: '/ajout'
  },
  {
    path: '/ajout',
    name: 'ajout',
    component: AjoutView
  },
  {
    path: '/liste',
    name: 'liste',
    component: ListeView
  },
  {
    path: '/bilan',
    name: 'bilan',
    component: BilanView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router