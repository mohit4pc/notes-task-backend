const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Get all notes
router.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new note
router.post("/notes", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newNote = await note.save();
    res.status(201).json({
      message: "Note Create Successfully",
      newNote,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single note
router.get("/notes/:id", getNote, (req, res) => {
  res.json(res.note);
});

// Update a note
router.patch("/notes/:id", getNote, async (req, res) => {
  if (req.body.title != null) {
    res.note.title = req.body.title;
  }
  if (req.body.content != null) {
    res.note.content = req.body.content;
  }
  try {
    const updatedNote = await res.note.save();
    res.json({
      message: "Note Update Succesfully",
      updatedNote,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a note
router.delete("/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id });
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

async function getNote(req, res, next) {
  let note;
  try {
    note = await Note.findById(req.params.id);
    if (note == null) {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.note = note;
  next();
}

module.exports = router;
