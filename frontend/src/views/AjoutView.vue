<template>
    <div class="h-full flex items-center justify-center">
        <div class="card-glass w-full max-w-2xl p-8">
            <div class="flex items-center space-x-3 mb-8">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span class="text-white text-2xl">➕</span>
                </div>
                <h1 class="text-3xl font-bold text-gray-800">Ajouter un client</h1>
            </div>

            <form @submit.prevent="confirmAdd" class="space-y-6">
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">📇 Numéro de compte</label>
                    <input v-model="form.numCompte" type="text" required class="input-field" placeholder="Ex: CBE001">
                </div>

                <div>
                    <label class="block text-gray-700 font-semibold mb-2">👤 Nom complet</label>
                    <input v-model="form.nom" type="text" required class="input-field" placeholder="Ex: Jean Dupont">
                </div>

                <div>
                    <label class="block text-gray-700 font-semibold mb-2">💰 Solde (€)</label>
                    <input v-model.number="form.solde" type="number" step="0.01" required class="input-field" placeholder="Ex: 2500.00">
                </div>

                <button type="submit" :disabled="loading" class="btn-primary w-full flex items-center justify-center space-x-2">
                    <span v-if="!loading">💾 Ajouter le client</span>
                    <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
const loading = ref(false)
const addModal = ref(null)

const showMessage = (msg, type) => {
    window.dispatchEvent(new CustomEvent('show-message', { detail: { message: msg, type } }))
}

const confirmAdd = async () => {
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
        } else {
            showMessage('❌ Insertion échouée', 'error')
        }
    } catch {
        showMessage('❌ Insertion échouée', 'error')
    } finally {
        loading.value = false
    }
}
</script>