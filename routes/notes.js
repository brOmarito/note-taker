// Package imports
const notes = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Pseudo DB for notes
const notesdb = require('../db/db.json');

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => {
    if (err) {
        console.error(err)
    } else {
        console.info(`\nData written to ${destination}`)
    }
});

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

notes.get('/', (req, res) => {
    const file = './db/db.json';
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

notes.post('/', (req, res) => {
    if (!req.body) {
        console.error('No request body received.');
    } else {
        const { title, text } = req.body;
        if (!title || !text) {
            console.error('The request should have a Title and Text.');
        } else {
            const newNote = {
                id: uuidv4(),
                title: title,
                text: text,
            }
            // Read/write to DB and handle response
            readAndAppend(newNote, './db/db.json')
            res.json({
                status: 'success',
                body: newNote,
            })
        }
    }
});

notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    const file = './db/db.json';
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            const newDb = parsedData.filter((value, index, arr) => {
                return value.id !== noteId;
            });
            writeToFile(file, newDb);
            res.json({
                status: 'success',
                body: noteId,
            })
        }
    });
});

module.exports = notes;