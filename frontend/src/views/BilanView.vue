cat > src/views/BilanView.vue << 'EOF'
<template>
    <div class="h-full flex flex-col">
        <!-- Entête -->
        <div class="flex items-center space-x-3 mb-4 flex-shrink-0">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white text-xl">📊</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">Bilan & Graphique</h1>
        </div>

        <!-- Cartes statistiques -->
        <div class="grid grid-cols-3 gap-4 mb-6 flex-shrink-0">
            <div class="card-glass p-4 text-center hover:scale-105 transition-all duration-300">
                <div class="text-3xl mb-2">💰</div>
                <div class="text-xs text-gray-500 uppercase font-semibold">Solde Total</div>
                <div class="text-xl font-bold text-green-600 mt-2">{{ formatSolde(bilan.total || 0) }}</div>
            </div>
            <div class="card-glass p-4 text-center hover:scale-105 transition-all duration-300">
                <div class="text-3xl mb-2">📉</div>
                <div class="text-xs text-gray-500 uppercase font-semibold">Solde Minimum</div>
                <div class="text-xl font-bold text-orange-600 mt-2">{{ formatSolde(bilan.min || 0) }}</div>
            </div>
            <div class="card-glass p-4 text-center hover:scale-105 transition-all duration-300">
                <div class="text-3xl mb-2">📈</div>
                <div class="text-xs text-gray-500 uppercase font-semibold">Solde Maximum</div>
                <div class="text-xl font-bold text-blue-600 mt-2">{{ formatSolde(bilan.max || 0) }}</div>
            </div>
        </div>

        <!-- Graphique -->
        <div class="card-glass flex-1 flex flex-col items-center justify-center p-6 mb-4">
            <canvas ref="chartCanvas" class="w-full max-h-80"></canvas>
        </div>

        <!-- Légende améliorée - plus grande et plus visible -->
        <div class="grid grid-cols-3 gap-4 mt-2 flex-shrink-0">
            <div class="bg-red-50 rounded-xl p-3 text-center border border-red-200">
                <div class="flex items-center justify-center space-x-2 mb-1">
                    <div class="w-5 h-5 bg-red-500 rounded-full shadow-md"></div>
                    <span class="font-bold text-red-700 text-base">Insuffisant</span>
                </div>
                <div class="text-xs text-red-600">Solde &lt; 1 000 €</div>
            </div>
            
            <div class="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-200">
                <div class="flex items-center justify-center space-x-2 mb-1">
                    <div class="w-5 h-5 bg-yellow-500 rounded-full shadow-md"></div>
                    <span class="font-bold text-yellow-700 text-base">Moyen</span>
                </div>
                <div class="text-xs text-yellow-600">Solde 1 000 - 5 000 €</div>
            </div>
            
            <div class="bg-green-50 rounded-xl p-3 text-center border border-green-200">
                <div class="flex items-center justify-center space-x-2 mb-1">
                    <div class="w-5 h-5 bg-green-500 rounded-full shadow-md"></div>
                    <span class="font-bold text-green-700 text-base">Élevé</span>
                </div>
                <div class="text-xs text-green-600">Solde &gt; 5 000 €</div>
            </div>
        </div>

        <!-- Information additionnelle -->
        <div class="mt-4 p-3 bg-gray-50 rounded-xl text-center text-sm text-gray-500 flex-shrink-0">
            📊 Le graphique montre la répartition des clients par catégorie de solde
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
            labels: ['Insuffisant (<1000€)', 'Moyen (1000-5000€)', 'Élevé (>5000€)'],
            datasets: [{
                data: [categories.insuffisant, categories.moyen, categories.eleve],
                backgroundColor: ['#ef4444', '#eab308', '#22c55e'],
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 14, weight: 'bold' },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    bodyFont: { size: 14 },
                    titleFont: { size: 14, weight: 'bold' },
                    callbacks: {
                        label: function(context) {
                            const label = context.label || ''
                            const value = context.parsed || 0
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                            return `${label}: ${value} client(s) (${percentage}%)`
                        }
                    }
                }
            },
            layout: {
                padding: 20
            }
        }
    })
}

onMounted(() => loadData())
</script>