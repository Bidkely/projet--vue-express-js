<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
        <!-- Animation de fond -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div class="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div class="relative z-10 w-full max-w-md mx-4">
            <div class="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105">
                <div class="text-center mb-8">
                    <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl mb-4 animate-float">
                        <span class="text-5xl">🏦</span>
                    </div>
                    <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        BanquePlus
                    </h1>
                    <p class="text-gray-500 text-sm mt-2">Espace professionnel sécurisé</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2 text-sm">👤 Identifiant</label>
                        <input 
                            v-model="loginForm.username" 
                            type="text" 
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                            placeholder="username"
                            required
                        >
                    </div>

                    <div>
                        <label class="block text-gray-700 font-semibold mb-2 text-sm">🔒 Mot de passe</label>
                        <input 
                            v-model="loginForm.password" 
                            type="password" 
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                            placeholder="••••••"
                            required
                        >
                    </div>

                    <button 
                        type="submit" 
                        :disabled="loading"
                        class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        <span v-if="!loading" class="flex items-center justify-center space-x-2">
                            <span>🔐</span>
                            <span>Se connecter</span>
                        </span>
                        <div v-else class="flex items-center justify-center space-x-2">
                            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Connexion...</span>
                        </div>
                    </button>
                </form>

                <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                    ❌ {{ errorMessage }}
                </div>

                <div class="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                    <p class="text-xs text-gray-500 text-center mb-2">🔐 Espace administrateur</p>
                    <div class="flex justify-center gap-4 text-xs">
                        <div class="text-center">
                            <p class="text-gray-400"></p>
                            <p class="font-mono font-bold text-blue-600 bg-white px-2 py-1 rounded-lg"></p>
                        </div>
                        <div class="text-center">
                            <p class="text-gray-400"></p>
                            <p class="font-mono font-bold text-blue-600 bg-white px-2 py-1 rounded-lg"></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center mt-6 text-white/50 text-xs">
                © 2024 BanquePlus - Application bancaire sécurisée
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginForm = reactive({ username: '', password: '' })
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = () => {
    loading.value = true
    errorMessage.value = ''
    
    // Simuler un délai de connexion
    setTimeout(() => {
        if (loginForm.username === 'admin' && loginForm.password === 'root03012006') {
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('user', loginForm.username)
            loading.value = false
            // Forcer la redirection complète
            window.location.href = '/ajout'
        } else {
            errorMessage.value = 'Identifiant ou mot de passe incorrect'
            loading.value = false
        }
    }, 800)
}
</script>

<style scoped>
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes blob {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

.animate-blob {
    animation: blob 7s infinite;
}

.animation-delay-2000 {
    animation-delay: 2s;
}

.animation-delay-4000 {
    animation-delay: 4s;
}
</style>