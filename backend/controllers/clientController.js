const Client = require('../models/Client');

// Obtenir tous les clients
const getClients = async (req, res) => {
    try {
        const clients = await Client.getAllClients();
        res.json({ success: true, data: clients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des clients' });
    }
};

// Ajouter un client
const addClient = async (req, res) => {
    try {
        const { numCompte, nom, solde } = req.body;
        
        // Validation
        if (!numCompte || !nom || solde === undefined) {
            return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
        }
        
        const id = await Client.addClient({ numCompte, nom, solde });
        res.json({ success: true, message: 'Insertion réussie', id });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: 'Ce numéro de compte existe déjà' });
        } else {
            res.status(500).json({ success: false, message: "Insertion échouée" });
        }
    }
};

// Modifier un client
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { numCompte, nom, solde } = req.body;
        
        const affected = await Client.updateClient(id, { numCompte, nom, solde });
        
        if (affected > 0) {
            res.json({ success: true, message: 'Modification réussie' });
        } else {
            res.status(404).json({ success: false, message: 'Client non trouvé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Modification échouée' });
    }
};

// Supprimer un client
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const affected = await Client.deleteClient(id);
        
        if (affected > 0) {
            res.json({ success: true, message: 'Suppression réussie' });
        } else {
            res.status(404).json({ success: false, message: 'Client non trouvé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Suppression échouée' });
    }
};

// Obtenir le bilan
const getBilan = async (req, res) => {
    try {
        const bilan = await Client.getBilan();
        res.json({ success: true, data: bilan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors du calcul du bilan' });
    }
};

module.exports = {
    getClients,
    addClient,
    updateClient,
    deleteClient,
    getBilan
};