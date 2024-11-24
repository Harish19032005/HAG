const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Player = require('./models/player');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const uri = 'mongodb+srv://hh5482481:1234@harish.6uq6j.mongodb.net/?retryWrites=true&w=majority&appName=Harish';
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Render the CRUD operations page
app.get('/', (req, res) => {
    res.render('index');  // Renders 'views/index.ejs'
});

app.post('/add-player', (req, res) => {
    const player = new Player(req.body);
    player.save()
        .then(() => res.redirect('/players'))
        .catch(err => res.status(500).send('Error adding player: ' + err));
});

//MULTIPLE PLAYERS
app.post('/add-players', (req, res) => {
    try {
        const players = JSON.parse(req.body.players);
        Player.insertMany(players)
            .then(() => res.redirect('/players'))
            .catch(err => res.status(500).send('Error adding players: ' + err));
    } catch (error) {
        res.status(400).send('Invalid JSON format');
    }
});

app.get('/players', (req, res) => {
    Player.find()
        .then(players => {
            res.render('players', { players: players }); // Render players.ejs with players data
        })
        .catch(err => res.status(500).send('Error fetching players: ' + err));
});

// List a single player by ID
app.get('/player', (req, res) => {
    Player.findById(req.query.id)
        .then(player => {
            if (player) {
                res.render('players', { players: [player] });
            } else {
                res.status(404).send('Player not found');
            }
        })
        .catch(err => res.status(500).send('Error fetching player: ' + err));
});

app.post('/update-player', (req, res) => {
    const { id, ...updateData } = req.body;
    Player.findByIdAndUpdate(id, updateData, { new: true })
        .then(() => res.redirect('/players'))
        .catch(err => res.status(500).send('Error updating player: ' + err));
});

app.post('/delete-player', (req, res) => {
    Player.findByIdAndDelete(req.body.id)
        .then(() => res.redirect('/players'))
        .catch(err => res.status(500).send('Error deleting player: ' + err));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
