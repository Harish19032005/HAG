const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// In-memory storage for student details
let students = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'i.html'));
});

// Get all students
app.get('/api/students', (req, res) => {
    res.json(students);
});

// Add a new student
app.post('/api/students', (req, res) => {
    const newStudent = { id: Date.now(), ...req.body };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// Update a student by ID
app.put('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    const index = students.findIndex((student) => student.id === studentId);

    if (index !== -1) {
        students[index] = { ...students[index], ...req.body };
        res.json(students[index]);
    } else {
        res.status(404).send('Student not found');
    }
});

// Delete a student by ID
app.delete('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    const index = students.findIndex((student) => student.id === studentId);

    if (index !== -1) {
        const deletedStudent = students.splice(index, 1);
        res.json(deletedStudent);
    } else {
        res.status(404).send('Student not found');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});