<template>
    <div class="h-full flex flex-col">
        <div class="flex items-center space-x-3 mb-4 flex-shrink-0">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white text-xl">📊</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">Bilan</h1>
        </div>

        <!-- Cartes en ligne -->
        <div class="grid grid-cols-3 gap-4 mb-6 flex-shrink-0">
            <div class="card-glass p-4 text-center hover:scale-105 transition-all">
                <div class="text-3xl mb-2">💰</div>
                <div class="text-xs text-gray-500">Total</div>
                <div class="text-xl font-bold text-green-600">{{ formatSolde(bilan.total || 0) }}</div>
            </div>
            <div class="card-glass p-4 text-center hover:scale-105 transition-all">
                <div class="text-3xl mb-2">📉</div>
                <div class="text-xs text-gray-500">Minimum</div>
                <div class="text-xl font-bold text-orange-600">{{ formatSolde(bilan.min || 0) }}</div>
            </div>
            <div class="card-glass p-4 text-center hover:scale-105 transition-all">
                <div class="text-3xl mb-2">📈</div>
                <div class="text-xs text-gray-500">Maximum</div>
                <div class="text-xl font-bold text-blue-600">{{ formatSolde(bilan.max || 0) }}</div>
            </div>
        </div>

        <!-- Graphique -->
        <div class="card-glass flex-1 flex flex-col items-center justify-center p-4">
            <canvas ref="chartCanvas" class="w-full max-h-64"></canvas>
        </div>

        <!-- Légende compacte -->
        <div class="flex justify-center space-x-4 mt-4 flex-shrink-0">
            <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-xs text-gray-600">&lt;1000€</span>
            </div>
            <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-xs text-gray-600">1000-5000€</span>
            </div>
            <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-xs text-gray-600">&gt;5000€</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { clientService } from '../services/api'
import Chart from 'chart.js/auto'

const bilan = ref({ total: 0, min: 0, max: 0 })
const clients = ref([])
const chartCanvas = ref(null)
let chart = null

const formatSolde = (solde) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(solde)
}

const getObservation = (solde) => {
    if (solde < 1000) return 'insuffisant'
    if (solde <= 5000) return 'moyen'
    return 'eleve'
}

const loadData = async () => {
    const [bilanResult, clientsResult] = await Promise.all([
        clientService.getBilan(),
        clientService.getAll()
    ])
    if (bilanResult.success) bilan.value = bilanResult.data
    if (clientsResult.success) clients.value = clientsResult.data
    await nextTick()
    renderChart()
}

const renderChart = () => {
    if (!chartCanvas.value) return
    if (chart) chart.destroy()
    
    const categories = { insuffisant: 0, moyen: 0, eleve: 0 }
    clients.value.forEach(client => categories[getObservation(client.solde)]++)
    
    chart = new Chart(chartCanvas.value.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Insuffisant', 'Moyen', 'Élevé'],
            datasets: [{
                data: [categories.insuffisant, categories.moyen, categories.eleve],
                backgroundColor: ['#ef4444', '#eab308', '#22c55e'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }
        }
    })
}

onMounted(() => loadData())
</script>