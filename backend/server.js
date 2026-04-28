const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/clients', require('./routes/clientRoutes'));

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend Express fonctionne sur Linux !' });
});

// Route racine
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon backend Express ! 🚀');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur backend sur http://localhost:${PORT}`);
    console.log(`📋 API clients: http://localhost:${PORT}/api/clients`);
});