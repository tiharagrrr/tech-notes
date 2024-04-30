const Note = require('../models/Note');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

//@desc     Get all notes
//@route GET /notes
//@access   Private
const getAllNotes = asyncHandler(async(req,res) => {
    //get all notes from db
    const notes = await Note.find().lean();

    //if no notes found
    if (!notes.length) {
        return res.status(404).json({message: 'No notes found'})
    }

    //add username to each note before sending response
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser);
})

//@desc     Create new note
//@route POST /notes
//@access   Private
const createNewNote = asyncHandler(async(req,res) => {
    const {user, title, text} = req.body;

    //confirm data
    if (!user || !title || !text) {
        return res.status(400).json({message: 'All fields are required'})
    }

    //check for duplicate title
    const duplicate = await Note.findOne({title}).lean().exec();

    if (duplicate) {
        return res.status(409).json({message: 'Duplicate note title'})
    }

    //create new note
    const note = await Note.create({user, title, text});

    if (note) {
        return res.status(201).json({message: 'New note created'})  

    } else {
        return res.status(400).json({message: 'Invalid note data recieved'})
    }
})

//@desc     Update note
//@route PATCH /notes
//@access   Private
const updateNote = asyncHandler(async(req, res) => {
    const {id, user, title, text, completed} = req.body;

    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({message: 'All fields are required'})
    }

    //check if note exists
    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(404).json({message: 'Note not found'})
    }

    //check for duplicate title
    const duplicate = await Note.findOne({title}).lean().exec();

    //allow duplicate title if it's the same note
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate note title'})
    }

    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();

    res.json(`'${updatedNote.title}' updated`)
})

//@desc     Delete note
//@route DELETE /notes
//@access   Private
const deleteNote = asyncHandler(async(req, res) => {
    const {id} = req.body;

    if (!id) {
        return res.status(400).json({message: 'Note ID is required'})
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(404).json({message: 'Note not found'})
    }

    const noteTitle = note.title;
    const noteId = note._id;  

    const result = await note.deleteOne();



    const reply = `Note '${noteTitle}' with ID  ${noteId} deleted`;

    res.json(reply) 
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}