const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { getDb } = require('../db/conn');

// GET all contacts
router.get('/', async (req, res) => {
  const db = getDb();
  const contacts = await db.collection('contacts').find().toArray();
  res.json(contacts);
});

// GET one contact by ID
router.get('/:id', async (req, res) => {
  const db = getDb();
  const contact = await db.collection('contacts').findOne({ _id: req.params.id });
  res.json(contact);
});

// POST new contact
router.post('/', async (req, res) => {
  const db = getDb();
  try {
    const result = await db.collection('contacts').insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error inserting contact:', err);
    res.status(500).json({ error: 'Failed to insert contact' });
  }
});

module.exports = router;
