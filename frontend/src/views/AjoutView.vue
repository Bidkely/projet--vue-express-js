<template>
    <div class="h-full flex items-center justify-center">
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-2xl p-8">
            <div class="flex items-center space-x-3 mb-8">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                    <span class="text-white text-2xl">➕</span>
                </div>
                <h1 class="text-3xl font-bold text-gray-800">Ajouter un client</h1>
            </div>

            <form @submit.prevent="confirmAdd" class="space-y-6">
                <div>
                    <label class="block font-semibold mb-2">📇 N° Compte</label>
                    <input v-model="form.numCompte" type="text" class="w-full px-4 py-2 border rounded-xl" placeholder="CBE001">
                </div>
                <div>
                    <label class="block font-semibold mb-2">👤 Nom</label>
                    <input v-model="form.nom" type="text" class="w-full px-4 py-2 border rounded-xl" placeholder="Jean Dupont">
                </div>
                <div>
                    <label class="block font-semibold mb-2">💰 Solde</label>
                    <input v-model.number="form.solde" type="number" step="0.01" class="w-full px-4 py-2 border rounded-xl" placeholder="2500.00">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold">💾 Ajouter</button>
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
const addModal = ref(null)

const showMessage = (msg, type) => {
    window.dispatchEvent(new CustomEvent('show-message', { detail: { message: msg, type } }))
}

const confirmAdd = async () => {
    if (!form.numCompte || !form.nom || !form.solde) {
        showMessage('Tous les champs sont requis', 'error')
        return
    }
    
    const confirmed = await addModal.value.show({
        title: 'Confirmation',
        message: `Ajouter "${form.nom}" avec ${form.solde} € ?`,
        type: 'warning',
        confirmText: 'Oui, ajouter'
    })
    
    if (confirmed) {
        const result = await clientService.add(form)
        if (result.success) {
            showMessage('✅ Insertion réussie', 'success')
            form.numCompte = ''
            form.nom = ''
            form.solde = ''
        } else {
            showMessage('❌ Insertion échouée', 'error')
        }
    }
}
</script>