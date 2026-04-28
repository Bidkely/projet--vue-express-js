<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cancel"></div>
      
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 transform transition-all animate-modal-in">
        <div class="text-center">
          <!-- Icône -->
          <div class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
               :class="type === 'danger' ? 'bg-red-100' : 'bg-blue-100'">
            <span class="text-4xl">{{ type === 'danger' ? '🗑️' : '✏️' }}</span>
          </div>
          
          <!-- Titre -->
          <h3 class="text-xl font-bold text-gray-800 mb-3">{{ title }}</h3>
          
          <!-- Message -->
          <p class="text-gray-600 mb-6">{{ message }}</p>
          
          <!-- Boutons -->
          <div class="flex space-x-3">
            <button @click="confirm" 
                    class="px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex-1"
                    :class="type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'">
              {{ confirmText }}
            </button>
            <button @click="cancel" 
                    class="px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
let resolvePromise = null
let modalOptions = ref({
  title: 'Confirmation',
  message: 'Êtes-vous sûr ?',
  type: 'warning',
  confirmText: 'Confirmer'
})

const show = (options) => {
  modalOptions.value = { ...modalOptions.value, ...options }
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

<style>
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modalIn 0.2s ease-out;
}
</style>