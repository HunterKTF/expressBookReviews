const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Registeer a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username, "password":password});
            return res.status(200).json({message:"User succesfully registered."})
        }
        else {
            return res.status(404).json({message:"User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop with promise/callback functions
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({books});
        }, 1000)
    })
    .then(data => {
        res.send(JSON.stringify(data, null, 4))
    })
});

// Get book details based on ISBN with promise/callback functions
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_isbn = null;
    for (let key in books) {
        if (key === isbn) {
            filtered_isbn = books[key];
            break;
        }
    }

    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({filtered_isbn})
        }, 5000)
    })
    .then(data => {
        res.send(filtered_isbn);
    })
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    var data = eval(books);
    var authors = '';
    var found = false;
    for (var key in data) {
        authors = books[key]['author'];

        if (author === authors){
            res.send(books[key]);
            found = true;
            break;
        }
    }
    if (!found){
        res.status(404).json({message: "Author not found!"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    var data = eval(books);
    var titles = '';
    var found = false;
    for (var key in data) {
        titles = books[key]['title'];

        if (title === titles){
            res.send(books[key]);
            found = true;
            break;
        }
    }
    if (!found) {
        res.status(404).json({message:"Title not found!"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]['reviews']);
});

module.exports.general = public_users;
