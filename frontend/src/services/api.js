import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Services clients
export const clientService = {
    // Récupérer tous les clients
    getAll: async () => {
        const response = await api.get('/clients')
        return response.data
    },
    
    // Ajouter un client
    add: async (client) => {
        const response = await api.post('/clients', client)
        return response.data
    },
    
    // Modifier un client
    update: async (id, client) => {
        const response = await api.put(`/clients/${id}`, client)
        return response.data
    },
    
    // Supprimer un client
    delete: async (id) => {
        const response = await api.delete(`/clients/${id}`)
        return response.data
    },
    
    // Obtenir le bilan
    getBilan: async () => {
        const response = await api.get('/clients/bilan')
        return response.data
    }
}

export default api