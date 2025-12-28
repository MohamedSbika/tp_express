const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId , email : user.email , name : user.name },
        process.env.JWT_SECRET || 'secret_par_defaut',
        { expiresIn: '7d' }
    );
};

// Inscription
exports.register = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        // Vérifier si l'email existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }

        // Créer l'utilisateur
        const user = await User.create({ name, email, password, age });

        res.status(201).json({
            success: true,
            message: 'Inscription réussie',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Connexion
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
        }

        // Trouver l'utilisateur avec le password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Récupérer son profil (route protégée)
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
