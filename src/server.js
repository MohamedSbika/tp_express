const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./api/routes/user.routes');
const logger = require('./middlewares/logger');

dotenv.config();
connectDB();

const app = express();
app.use(logger);
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Formation Express' });
});

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
