// Middleware d'authentification simple pour l'API
const authMiddleware = (req, res, next) => {
    // Pour l'instant, on accepte toutes les requêtes du frontend
    // À améliorer avec JWT si besoin
    const token = req.headers['authorization'];
    
    // Version simple pour le développement
    // Le frontend gère déjà l'authentification visuelle
    next();
};

module.exports = authMiddleware;
