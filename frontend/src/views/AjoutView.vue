<template>
    <div class="h-full flex items-center justify-center">
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-2xl p-8">
            <div class="flex items-center space-x-3 mb-8">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span class="text-white text-2xl">➕</span>
                </div>
                <h1 class="text-3xl font-bold text-gray-800">Ajouter un client</h1>
            </div>

            <form @submit.prevent="confirmAdd" class="space-y-6">
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">📇 Numéro de compte</label>
                    <input 
                        v-model="form.numCompte" 
                        type="text" 
                        class="w-full px-4 py-2 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        :class="errors.numCompte ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                        placeholder="Ex: CBE001"
                    >
                    <p v-if="errors.numCompte" class="text-red-500 text-sm mt-1">{{ errors.numCompte }}</p>
                </div>

                <div>
                    <label class="block text-gray-700 font-semibold mb-2">👤 Nom complet</label>
                    <input 
                        v-model="form.nom" 
                        type="text" 
                        class="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Ex: Jean Dupont"
                    >
                </div>

                <div>
                    <label class="block text-gray-700 font-semibold mb-2">💰 Solde (€)</label>
                    <input 
                        v-model.number="form.solde" 
                        type="number" 
                        step="0.01" 
                        class="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Ex: 2500.00"
                    >
                </div>

                <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    <span v-if="!loading">💾 Ajouter le client</span>
                    <div v-else class="flex items-center justify-center space-x-2">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Ajout en cours...</span>
                    </div>
                </button>
            </form>
        </div>

        <ConfirmModal ref="addModal" />
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { clientService } from '../services/api'
import ConfirmModal from '../components/ConfirmModal.vue'

const form = reactive({ numCompte: '', nom: '', solde: '' })
const errors = reactive({ numCompte: '' })
const loading = ref(false)
const addModal = ref(null)

const showMessage = (msg, type) => {
    window.dispatchEvent(new CustomEvent('show-message', { detail: { message: msg, type } }))
}

const confirmAdd = async () => {
    // Réinitialiser les erreurs
    errors.numCompte = ''
    
    if (!form.numCompte || !form.nom || form.solde === '') {
        showMessage('❌ Tous les champs sont requis', 'error')
        return
    }
    
    const confirmed = await addModal.value.show({
        title: 'Confirmation d\'ajout',
        message: `Voulez-vous ajouter le client "${form.nom}" avec un solde de ${form.solde} € ?`,
        type: 'warning',
        confirmText: 'Oui, ajouter'
    })
    
    if (confirmed) {
        await submitForm()
    }
}

const submitForm = async () => {
    loading.value = true
    try {
        const result = await clientService.add(form)
        if (result.success) {
            showMessage('✅ Insertion réussie !', 'success')
            form.numCompte = ''
            form.nom = ''
            form.solde = ''
            errors.numCompte = ''
        } else {
            // Afficher le message d'erreur spécifique du serveur
            if (result.message.includes('numéro de compte existe déjà')) {
                errors.numCompte = result.message
                showMessage('❌ ' + result.message, 'error')
            } else {
                showMessage('❌ ' + (result.message || 'Insertion échouée'), 'error')
            }
        }
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Erreur de connexion au serveur'
        if (errorMsg.includes('numéro de compte existe déjà')) {
            errors.numCompte = errorMsg
        }
        showMessage('❌ ' + errorMsg, 'error')
    } finally {
        loading.value = false
    }
}
</script>