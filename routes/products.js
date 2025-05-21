// routes/products.js
const express = require('express');
const router = express.Router();
const { getDb } = require('../db/conn');
const { ObjectId } = require('mongodb');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - quantity
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the product
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: integer
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         name: "Logitech Mouse"
 *         description: "Wireless ergonomic mouse"
 *         price: 29.99
 *         quantity: 100
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid product data
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid product data
 *       404:
 *         description: Product not found
 *
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */


// GET all products
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const products = await db.collection('products').find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET one product by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    if (!name || !description || typeof price !== 'number' || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Invalid product data' });
    }
    const db = getDb();
    const result = await db.collection('products').insertOne({ name, description, price, quantity });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    if (!name || !description || typeof price !== 'number' || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Invalid product data' });
    }
    const db = getDb();
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, description, price, quantity } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product by ID
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
