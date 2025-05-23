const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { connectToDB } = require('./db/conn');

app.use(express.json());

const setupSwagger = require('./utils/swagger');
setupSwagger(app);

// Routes
// Contacts routes
const contactsRoutes = require('./routes/contacts');
app.use('/contacts', contactsRoutes);

// Products routes
const productsRoutes = require('./routes/products');
app.use('/products', productsRoutes);


app.get('/', (req, res) => {
  res.send('Hello World from CSE 341!');
});

// This is to wait a conectar a la base antes de start el server
connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
});

