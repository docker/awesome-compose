const express = require('express');
const mongoose = require('mongoose');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.NODE_PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/notesdb';

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Express + MongoDB API is running' });
});

app.use('/notes', notesRouter);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
