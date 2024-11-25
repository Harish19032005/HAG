const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect('mongodb+srv://akashbs:akashbs@akash.0sg2z.mongodb.net/?retryWrites=true&w=majority&appName=akash/studentDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema and Model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
});

const Student = mongoose.model('Student', studentSchema);

// CRUD Routes

// Create a new student
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).send(newStudent);
  } catch (err) {
    res.status(400).send({ error: 'Error creating student' });
  }
});

// Retrieve all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (err) {
    res.status(500).send({ error: 'Error fetching students' });
  }
});

// Update an existing student by ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).send({ error: 'Student not found' });
    }
    res.status(200).send(updatedStudent);
  } catch (err) {
    res.status(400).send({ error: 'Error updating student' });
  }
});

// Delete a student by ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).send({ error: 'Student not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send({ error: 'Error deleting student' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
