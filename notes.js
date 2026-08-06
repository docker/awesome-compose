const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// GET /notes - list all notes
router.get('/', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

// POST /notes - create a note
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /notes/:id - get a single note
router.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// PUT /notes/:id - update a note
router.put('/:id', async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    { new: true, runValidators: true }
  );
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// DELETE /notes/:id - delete a note
router.delete('/:id', async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.status(204).send();
});

module.exports = router;
