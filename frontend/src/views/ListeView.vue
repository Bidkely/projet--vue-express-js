<template>
    <div class="h-full flex flex-col">
        <div class="flex items-center space-x-3 mb-4 flex-shrink-0">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white text-xl">📋</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">Liste des Clients</h1>
            <span class="text-sm text-gray-500 ml-2">({{ clients.length }} clients)</span>
        </div>

        <div class="card-glass flex-1 overflow-auto">
            <table class="w-full">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">N° Compte</th>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Solde</th>
                        <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Observation</th>
                        <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="client in clients" :key="client.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ client.nom }}</td>
                        <td class="px-4 py-3 text-sm text-gray-600 font-mono">{{ client.numCompte }}</td>
                        <td class="px-4 py-3 text-sm text-right font-semibold">{{ formatSolde(client.solde) }}</td>
                        <td class="px-4 py-3 text-center">
                            <span :class="getObsClass(client.solde)" class="px-2 py-1 rounded-full text-xs font-semibold">
                                {{ getObservation(client.solde) }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-center space-x-3">
                            <button @click="openEditModal(client)" class="text-blue-600 hover:text-blue-800 transition-all hover:scale-110" title="Modifier">
                                ✏️ Modifier
                            </button>
                            <button @click="openDeleteModal(client)" class="text-red-600 hover:text-red-800 transition-all hover:scale-110" title="Supprimer">
                                🗑️ Supprimer
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="clients.length === 0" class="text-center py-12 text-gray-500">
                Aucun client enregistré
            </div>
        </div>

        <!-- Modal de modification -->
        <div v-if="editModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeEditModal">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-modal-in">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">✏️ Modifier le client</h2>
                    <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                
                <form @submit.prevent="confirmUpdate" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Numéro de compte</label>
                        <input v-model="editForm.numCompte" type="text" required class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
                        <input v-model="editForm.nom" type="text" required class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Solde (€)</label>
                        <input v-model.number="editForm.solde" type="number" step="0.01" required class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div class="flex space-x-3 pt-4">
                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition-all">
                            💾 Enregistrer
                        </button>
                        <button type="button" @click="closeEditModal" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-xl font-semibold transition-all">
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modals -->
        <ConfirmModal ref="confirmUpdateModal" />
        <ConfirmModal ref="confirmDeleteModal" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { clientService } from '../services/api'
import ConfirmModal from '../components/ConfirmModal.vue'

const clients = ref([])
const editModalOpen = ref(false)
const editForm = ref({ id: '', numCompte: '', nom: '', solde: '' })

const confirmUpdateModal = ref(null)
const confirmDeleteModal = ref(null)

const showMessage = (msg, type) => {
    window.dispatchEvent(new CustomEvent('show-message', { detail: { message: msg, type } }))
}

const loadClients = async () => {
    const result = await clientService.getAll()
    if (result.success) clients.value = result.data
}

const getObservation = (solde) => {
    if (solde < 1000) return 'insuffisant'
    if (solde <= 5000) return 'moyen'
    return 'élève'
}

const getObsClass = (solde) => {
    if (solde < 1000) return 'bg-red-100 text-red-700'
    if (solde <= 5000) return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
}

const formatSolde = (solde) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(solde)
}

// Modification
const openEditModal = (client) => {
    editForm.value = { ...client }
    editModalOpen.value = true
}

const closeEditModal = () => {
    editModalOpen.value = false
    editForm.value = { id: '', numCompte: '', nom: '', solde: '' }
}

const confirmUpdate = async () => {
    const confirmed = await confirmUpdateModal.value.show({
        title: 'Confirmation',
        message: `Voulez-vous vraiment modifier les informations du client "${editForm.value.nom}" ?`,
        type: 'warning',
        confirmText: 'Oui, modifier'
    })
    
    if (confirmed) {
        await updateClient()
    }
}

const updateClient = async () => {
    try {
        const result = await clientService.update(editForm.value.id, editForm.value)
        if (result.success) {
            showMessage('✅ Modification réussie !', 'success')
            await loadClients()
            closeEditModal()
        } else {
            showMessage('❌ Modification échouée', 'error')
        }
    } catch {
        showMessage('❌ Modification échouée', 'error')
    }
}

// Suppression
const openDeleteModal = async (client) => {
    const confirmed = await confirmDeleteModal.value.show({
        title: 'Confirmation de suppression',
        message: `Voulez-vous vraiment supprimer le client "${client.nom}" ? Cette action est irréversible.`,
        type: 'danger',
        confirmText: 'Oui, supprimer'
    })
    
    if (confirmed) {
        const result = await clientService.delete(client.id)
        if (result.success) {
            showMessage('✅ Suppression réussie !', 'success')
            await loadClients()
        } else {
            showMessage('❌ Suppression échouée', 'error')
        }
    }
}

onMounted(() => loadClients())
</script>

<style>
.animate-modal-in {
    animation: modalIn 0.2s ease-out;
}
@keyframes modalIn {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}
</style>