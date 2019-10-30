// Your assignment is to define the routes below. Good luck!

// Dependencies
var express = require("express");
var logger = require("morgan");
var mongojs = require("mongojs");

// Initialize Express
var app = express();

// Configure our app for morgan and body parsing with express.json and express.urlEncoded
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Mongojs configuration
var databaseUrl = "warmup";
var collections = ["books"];

// Hook our mongojs config to the db var
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

// Routes
// ======

// TODO: Fill in each route so that the server performs
// the proper mongojs functions for the site to function
// -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/

// Post a book to the mongoose database
app.post("/submit", function (req, res) {
  // Save the request body as an object called book
  var book = req.body;

  // If we want the object to have a boolean value of false,
  // we have to do it here, because the ajax post will convert it
  // to a string instead of a boolean
  book.read = false;

  db.books.save(book, function (error, saved) {
    if (error) {
      console.log(error);
    }
    else {
      res.send(saved);
    }
  });
});

// Find all books marked as read
app.get("/read", function (req, res) {
  db.books.find({ read: true }, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

// Find all books marked as unread
app.get("/unread", function (req, res) {
  db.books.find({ read: false }, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

// Mark a book as having been read
app.put("/markread/:id", function (req, res) {
  db.books.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        read: true
      }
    },
    function (error, edited) {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(edited);
        res.send(edited);
      }
    }
  );
});

// Mark a book as having been not read
app.put("/markunread/:id", function(req, res) {

  db.books.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        read: false
      }
    },
    function(error, edited) {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(edited);
        res.send(edited);
      }
    }
  );
});

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
