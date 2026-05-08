<template>
    <div v-if="isAuthenticated" class="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <header class="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm flex-shrink-0">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <span class="text-2xl animate-pulse">🏦</span>
                        <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            BanquePlus
                        </span>
                    </div>
                    
                    <nav class="flex space-x-2">
                        <router-link to="/ajout" class="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105" :class="$route.path === '/ajout' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'">
                            📝 Ajout
                        </router-link>
                        <router-link to="/liste" class="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105" :class="$route.path === '/liste' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'">
                            📋 Liste
                        </router-link>
                        <router-link to="/bilan" class="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105" :class="$route.path === '/bilan' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'">
                            📊 Bilan
                        </router-link>
                    </nav>
                    
                    <div class="flex items-center space-x-3">
                        <div class="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full">
                            <span class="text-sm">👤</span>
                            <span class="text-sm font-medium text-gray-700">{{ userName }}</span>
                        </div>
                        <button @click="logout" class="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all">
                            <span>🚪</span>
                            <span class="text-sm font-medium">Déconnexion</span>
                        </button>
                        <button @click="showGuide = true" class="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                            <span class="text-gray-600">❓</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-auto">
            <div class="container mx-auto px-4 py-4 h-full">
                <router-view />
            </div>
        </main>

        <!-- Guide utilisateur -->
        <div v-if="showGuide" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showGuide = false"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4">
                <div class="bg-white rounded-2xl shadow-2xl p-6">
                    <div class="text-center mb-4">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span class="text-3xl">🎯</span>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800">Guide d'utilisation</h2>
                        <p class="text-gray-500 text-sm mt-1">Voici comment utiliser l'application</p>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                            <span class="text-xl">📝</span>
                            <div>
                                <h3 class="font-semibold text-gray-800">Ajouter un client</h3>
                                <p class="text-sm text-gray-600">Remplissez le formulaire dans l'onglet "Ajout"</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                            <span class="text-xl">✏️</span>
                            <div>
                                <h3 class="font-semibold text-gray-800">Modifier un client</h3>
                                <p class="text-sm text-gray-600">Cliquez sur "Modifier" puis confirmez</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3 p-3 bg-red-50 rounded-xl">
                            <span class="text-xl">🗑️</span>
                            <div>
                                <h3 class="font-semibold text-gray-800">Supprimer un client</h3>
                                <p class="text-sm text-gray-600">Cliquez sur "Supprimer" puis confirmez</p>
                            </div>
                        </div>
                    </div>
                    
                    <button @click="showGuide = false" class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold">
                        C'est parti ! 🚀
                    </button>
                </div>
            </div>
        </div>

        <!-- Toast -->
        <div v-if="toast.visible" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
            <div :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'" class="px-6 py-3 rounded-xl shadow-lg text-white font-semibold">
                {{ toast.type === 'success' ? '✅' : '❌' }} {{ toast.message }}
            </div>
        </div>
    </div>
    
    <!-- Page de login uniquement -->
    <LoginView v-else />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LoginView from './views/LoginView.vue'

const toast = ref({ visible: false, message: '', type: 'success' })
const showGuide = ref(false)
let timeout

const isAuthenticated = computed(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
})

const userName = computed(() => {
    return localStorage.getItem('user') || 'Utilisateur'
})

const showToast = (event) => {
    toast.value = { visible: true, message: event.detail.message, type: event.detail.type }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => { toast.value.visible = false }, 3000)
}

const logout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    window.location.href = '/login'
}

onMounted(() => {
    window.addEventListener('show-message', showToast)
})

onUnmounted(() => {
    window.removeEventListener('show-message', showToast)
    if (timeout) clearTimeout(timeout)
})
</script>

<style>
.animate-slide-up {
    animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
</style>