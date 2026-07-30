const express = require('express');
const Lead = require('../models/Lead');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All lead routes require a valid admin token
router.use(authMiddleware);

// GET /api/leads - list all leads (supports ?status= filter and ?search=)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/leads/:id - single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/leads - create new lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, source, status, followUpDate } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const lead = await Lead.create({ name, email, phone, source, status, followUpDate });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PUT /api/leads/:id - update lead details/status
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, source, status, followUpDate } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, source, status, followUpDate },
      { new: true, runValidators: true }
    );

    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/leads/:id/notes - add a follow-up note
router.post('/:id/notes', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Note text is required.' });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });

    lead.notes.push({ text });
    await lead.save();

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// DELETE /api/leads/:id - remove a lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    res.json({ message: 'Lead deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
