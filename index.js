const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Here I did MongoDB Connection // Here we used dummy string to connect the mongodb because I have only one free cluster that, I have been used //
mongoose.connect('mongodb://localhost/books_api', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));

// this is a Book Model
const Book = mongoose.model('Book', {
    title: String,
    author: String,
    summary: String
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API Endpoints
app.post('/api/books', (req, res) => {
    const { title, author, summary } = req.body;
    const book = new Book({ title, author, summary });
    book.save((err, savedBook) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(savedBook);
        }
    });
});

app.get('/api/books', (req, res) => {
    Book.find({}, (err, books) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(books);
        }
    });
});

app.get('/api/books/:id', (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(book);
        }
    });
});

app.put('/api/books/:id', (req, res) => {
    const { title, author, summary } = req.body;
    Book.findByIdAndUpdate(req.params.id, { title, author, summary }, (err, updatedBook) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(updatedBook);
        }
    });
});

app.delete('/api/books/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err, book) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(book);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
