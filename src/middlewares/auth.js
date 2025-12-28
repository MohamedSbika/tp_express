const jwt = require('jsonwebtoken');
const User = require('../api/models/user.model');

// Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Vérifier si le header Authorization existe
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Vérifier si le token existe
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé. Veuillez vous connecter.'
            });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_par_defaut');

        // Récupérer l'utilisateur
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré'
        });
    }
};
