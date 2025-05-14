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

// Update contact by ID (PUT)
router.put('/:id', async (req, res) => {
  const db = getDb();
  const contactId = req.params.id;

  try {
    const result = await db.collection('contacts').updateOne(
      { _id: contactId },
      { $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          favoriteColor: req.body.favoriteColor,
          birthday: req.body.birthday
      }}
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Remove contact by ID (Borrar - DELETE)
router.delete('/:id', async (req, res) => {
  const db = getDb();
  const contactId = req.params.id;

  try {
    const result = await db.collection('contacts').deleteOne({ _id: contactId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
