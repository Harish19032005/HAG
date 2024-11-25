const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '.')));
app.use(express.json());

let notes = [];

// Get all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// Add a new note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  const newNote = { id: Date.now(), title, content };
  notes.push(newNote);
  res.json(newNote);
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  notes = notes.filter(note => note.id !== parseInt(id));
  res.json({ message: 'Note deleted' });
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const note = notes.find(note => note.id === parseInt(id));
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  note.title = title || note.title;
  note.content = content || note.content;
  res.json(note);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port "+PORT);
});
