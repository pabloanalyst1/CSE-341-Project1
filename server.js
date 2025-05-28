const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const mongoDB = require('./db/conn');

// Cargar variables de entorno
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session y Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
require('./auth/passport');
app.use(passport.initialize());
app.use(passport.session());

// Rutas
const contactRoutes = require('./routes/contacts');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
app.use('/contacts', contactRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);

// Swagger
const setupSwagger = require('./utils/swagger');
setupSwagger(app);

// Conexión a la BD y arranque del servidor
const port = process.env.PORT || 3000;

mongoDB.connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  });