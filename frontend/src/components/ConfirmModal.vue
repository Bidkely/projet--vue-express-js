<template>
  <div v-if="visible" class="fixed inset-0 z-50">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cancel"></div>
    
    <!-- Modal -->
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-2xl mx-4 p-6">
        <div class="text-center">
          <!-- Icône -->
          <div class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
               :class="type === 'danger' ? 'bg-red-100' : 'bg-blue-100'">
            <span class="text-4xl">{{ type === 'danger' ? '🗑️' : '✏️' }}</span>
          </div>
          
          <!-- Titre -->
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ title }}</h3>
          
          <!-- Message -->
          <p class="text-gray-600 mb-6">{{ message }}</p>
          
          <!-- Boutons -->
          <div class="flex gap-3">
            <button @click="confirm" 
                    class="flex-1 py-2 rounded-xl font-semibold transition-all"
                    :class="type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'">
              {{ confirmText }}
            </button>
            <button @click="cancel" 
                    class="flex-1 py-2 rounded-xl font-semibold transition-all bg-gray-200 hover:bg-gray-300 text-gray-800">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
let resolvePromise = null
const title = ref('Confirmation')
const message = ref('Êtes-vous sûr ?')
const type = ref('warning')
const confirmText = ref('Confirmer')

const show = (options) => {
  title.value = options.title || 'Confirmation'
  message.value = options.message || 'Êtes-vous sûr ?'
  type.value = options.type || 'warning'
  confirmText.value = options.confirmText || 'Confirmer'
  visible.value = true
  
  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

const confirm = () => {
  visible.value = false
  if (resolvePromise) resolvePromise(true)
}

const cancel = () => {
  visible.value = false
  if (resolvePromise) resolvePromise(false)
}

defineExpose({ show })
</script>