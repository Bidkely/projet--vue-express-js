cat > src/views/ListeView.vue << 'EOF'
<template>
    <div class="h-full flex flex-col">
        <!-- Entête -->
        <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <span class="text-white text-xl">📋</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">Liste des Clients</h1>
            <span class="text-sm text-gray-500">({{ clients.length }} clients)</span>
        </div>

        <!-- Légende des actions -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center justify-center space-x-6 text-sm">
            <div class="flex items-center space-x-2">
                <span class="text-blue-600">✏️</span>
                <span class="text-gray-600">Cliquer pour modifier</span>
            </div>
            <div class="w-px h-4 bg-blue-200"></div>
            <div class="flex items-center space-x-2">
                <span class="text-red-600">🗑️</span>
                <span class="text-gray-600">Cliquer pour supprimer</span>
            </div>
            <div class="w-px h-4 bg-blue-200"></div>
            <div class="flex items-center space-x-2">
                <span class="text-green-600">💾</span>
                <span class="text-gray-600">Confirmer après modification</span>
            </div>
        </div>

        <!-- Tableau -->
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl flex-1 overflow-auto">
            <table class="w-full">
                <thead class="bg-gray-50 sticky top-0">
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
                        <td class="px-4 py-3 text-sm font-medium">{{ client.nom }}</td>
                        <td class="px-4 py-3 text-sm font-mono">{{ client.numCompte }}</td>
                        <td class="px-4 py-3 text-sm text-right font-semibold">{{ formatSolde(client.solde) }}</td>
                        <td class="px-4 py-3 text-center">
                            <span :class="getObsClass(client.solde)" class="px-2 py-1 rounded-full text-xs font-semibold">
                                {{ getObservation(client.solde) }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-center">
                            <div class="flex items-center justify-center space-x-3">
                                <!-- Bouton Modifier -->
                                <button @click="openEditModal(client)" class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1">
                                    <span>✏️</span>
                                    <span class="text-sm font-medium">Modifier</span>
                                </button>
                                
                                <!-- Bouton Supprimer -->
                                <button @click="openDeleteModal(client)" class="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1">
                                    <span>🗑️</span>
                                    <span class="text-sm font-medium">Supprimer</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="clients.length === 0" class="text-center py-12 text-gray-500">
                Aucun client enregistré
            </div>
        </div>

        <!-- Modal modification -->
        <div v-if="showEditModal" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeEditModal"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4">
                <div class="bg-white rounded-2xl shadow-2xl p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span class="text-xl">✏️</span>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800">Modifier le client</h2>
                    </div>
                    <p class="text-gray-500 text-sm mb-4">Modifiez les informations ci-dessous :</p>
                    <form @submit.prevent="confirmUpdate">
                        <div class="mb-3">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Numéro de compte</label>
                            <input v-model="editForm.numCompte" type="text" class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="mb-3">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
                            <input v-model="editForm.nom" type="text" class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Solde (€)</label>
                            <input v-model.number="editForm.solde" type="number" step="0.01" class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="flex gap-3">
                            <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold">
                                💾 Enregistrer
                            </button>
                            <button type="button" @click="closeEditModal" class="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-xl font-semibold">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Modals de confirmation -->
        <ConfirmModal ref="deleteModal" />
        <ConfirmModal ref="updateModal" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { clientService } from '../services/api'
import ConfirmModal from '../components/ConfirmModal.vue'

const clients = ref([])
const showEditModal = ref(false)
const editForm = ref({ id: '', numCompte: '', nom: '', solde: '' })

const deleteModal = ref(null)
const updateModal = ref(null)

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

const openEditModal = (client) => {
    editForm.value = { ...client }
    showEditModal.value = true
}

const closeEditModal = () => {
    showEditModal.value = false
    editForm.value = { id: '', numCompte: '', nom: '', solde: '' }
}

const confirmUpdate = async () => {
    const confirmed = await updateModal.value.show({
        title: 'Confirmation de modification',
        message: `Voulez-vous enregistrer les modifications pour "${editForm.value.nom}" ?`,
        type: 'warning',
        confirmText: 'Oui, modifier'
    })
    
    if (confirmed) {
        const result = await clientService.update(editForm.value.id, editForm.value)
        if (result.success) {
            showMessage('✅ Modification réussie !', 'success')
            await loadClients()
            closeEditModal()
        } else {
            showMessage('❌ Modification échouée', 'error')
        }
    }
}

const openDeleteModal = async (client) => {
    const confirmed = await deleteModal.value.show({
        title: 'Confirmation de suppression',
        message: `Voulez-vous vraiment supprimer "${client.nom}" ? Cette action est irréversible.`,
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