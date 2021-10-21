const express = require("express");
const path = require("path");
const fs = require("fs");

// Set up Express app to listen on port 3000
let app = express();
let PORT = process.env.PORT || 3000;

// Set up Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
let notes = require("./db/db.json");

// Routes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Display notes
app.get("/api/notes", function (req, res) {
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(notes);
  });
});
// Starting server
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

// Create a new note
app.post("/api/notes", function (req, res) {
  // Using a random letter and current date/time to create an id for each note
  let randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  let id = randomLetter + Date.now();
  let newNote = {
    id: id,
    title: req.body.title,
    text: req.body.text,
  };
  console.log(typeof notes);
  notes.push(newNote);
  const stringifyNote = JSON.stringify(notes);
  res.json(notes);
  fs.writeFile("db/db.json", stringifyNote, (err) => {
    if (err) console.log(err);
    else {
      console.log("Note saved to db.json");
    }
  });
});

// Delete note
app.delete("/api/notes/:id", function (req, res) {
  let noteID = req.params.id;
  fs.readFile("db/db.json", "utf8", function (err, data) {
    let updatedNotes = JSON.parse(data).filter((note) => {
      console.log("note.id", note.id);
      console.log("noteID", noteID);
      return note.id !== noteID;
    });
    notes = updatedNotes;
    const stringifyNote = JSON.stringify(updatedNotes);
    fs.writeFile("db/db.json", stringifyNote, (err) => {
      if (err) console.log(err);
      else {
        console.log("Note successfully deleted from db.json");
      }
    });
    res.json(stringifyNote);
  });
});

// Catch all error route
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

