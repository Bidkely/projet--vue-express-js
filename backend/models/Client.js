const db = require('../config/db');

// Obtenir tous les clients
const getAllClients = async () => {
    const [rows] = await db.query('SELECT * FROM clients_bancaires ORDER BY id');
    return rows;
};

// Obtenir un client par ID
const getClientById = async (id) => {
    const [rows] = await db.query('SELECT * FROM clients_bancaires WHERE id = ?', [id]);
    return rows[0];
};

// Ajouter un client
const addClient = async (client) => {
    const { numCompte, nom, solde } = client;
    const [result] = await db.query(
        'INSERT INTO clients_bancaires (numCompte, nom, solde) VALUES (?, ?, ?)',
        [numCompte, nom, solde]
    );
    return result.insertId;
};

// Modifier un client
const updateClient = async (id, client) => {
    const { numCompte, nom, solde } = client;
    const [result] = await db.query(
        'UPDATE clients_bancaires SET numCompte = ?, nom = ?, solde = ? WHERE id = ?',
        [numCompte, nom, solde, id]
    );
    return result.affectedRows;
};

// Supprimer un client
const deleteClient = async (id) => {
    const [result] = await db.query('DELETE FROM clients_bancaires WHERE id = ?', [id]);
    return result.affectedRows;
};

// Obtenir le bilan (total, min, max)
const getBilan = async () => {
    const [rows] = await db.query(
        'SELECT SUM(solde) as total, MIN(solde) as min, MAX(solde) as max FROM clients_bancaires'
    );
    return rows[0];
};

module.exports = {
    getAllClients,
    getClientById,
    addClient,
    updateClient,
    deleteClient,
    getBilan
};