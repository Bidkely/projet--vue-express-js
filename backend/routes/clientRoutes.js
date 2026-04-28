const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Routes CRUD
router.get('/', clientController.getClients);
router.post('/', clientController.addClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);
router.get('/bilan', clientController.getBilan);

module.exports = router;