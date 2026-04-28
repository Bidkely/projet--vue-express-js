<template>
    <div class="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <!-- Header fixe -->
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
                </div>
            </div>
        </header>

        <!-- Contenu principal - prend tout l'espace restant sans overflow -->
        <main class="flex-1 flex flex-col overflow-hidden">
            <div class="flex-1 overflow-auto">
                <div class="container mx-auto px-4 py-4 h-full">
                    <router-view />
                </div>
            </div>
        </main>

        <!-- Toast message -->
        <div v-if="toast.visible" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
            <div :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'" class="px-6 py-3 rounded-xl shadow-lg text-white font-semibold">
                {{ toast.type === 'success' ? '✅' : '❌' }} {{ toast.message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toast = ref({ visible: false, message: '', type: 'success' })
let timeout

const showToast = (event) => {
    toast.value = { visible: true, message: event.detail.message, type: event.detail.type }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => { toast.value.visible = false }, 3000)
}

onMounted(() => window.addEventListener('show-message', showToast))
onUnmounted(() => window.removeEventListener('show-message', showToast))
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