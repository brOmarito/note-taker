const note = require('express').Router();
const notes = require('../db/db.json');

note.get('/', (req,res) =>
    res.json(notes)
);

module.exports = note;