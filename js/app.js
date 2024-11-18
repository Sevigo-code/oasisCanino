const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Configuración de la base de datos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
});

// Modelos
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

const Dog = sequelize.define('Dog', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

const Reservation = sequelize.define('Reservation', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    dogId: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

// Relaciones
User.hasMany(Dog, { foreignKey: 'userId' });
Dog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Dog.hasMany(Reservation, { foreignKey: 'dogId' });
Reservation.belongsTo(Dog, { foreignKey: 'dogId' });

// Sincronización con la base de datos
sequelize.sync().then(() => console.log('Base de datos sincronizada')).catch(console.error);

// Configuración de la aplicación
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Rutas

// Usuarios
app.post('/api/users/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: 'Error al registrar usuario.' });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username, password } });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Usuario o contraseña incorrectos.' });
        }
    } catch (err) {
        res.status(400).json({ error: 'Error al iniciar sesión.' });
    }
});

// Perros
app.get('/api/dogs', async (req, res) => {
    const { userId } = req.query;
    const dogs = await Dog.findAll({ where: { userId } });
    res.json(dogs);
});

app.post('/api/dogs', async (req, res) => {
    const { name, age, userId } = req.body;
    const dog = await Dog.create({ name, age, userId });
    res.status(201).json(dog);
});

// Reservas
app.get('/api/reservations', async (req, res) => {
    const reservations = await Reservation.findAll();
    res.json(reservations);
});

app.post('/api/reservations', async (req, res) => {
    const { date, userId, dogId } = req.body;
    const reservation = await Reservation.create({ date, userId, dogId });
    res.status(201).json(reservation);
});

app.put('/api/reservations/cancel', async (req, res) => {
    const { id } = req.body;
    const reservation = await Reservation.findByPk(id);
    if (reservation) {
        reservation.status = 'canceled';
        await reservation.save();
        res.json(reservation);
    } else {
        res.status(404).json({ error: 'Reserva no encontrada.' });
    }
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
