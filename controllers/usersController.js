const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler'); //to handle async errors without using many try catch blocks
const bcrypt = require('bcryptjs'); //to save passwords in a hashed format

const getAllUsers = asyncHandler(async(req,res) => {
    const users = await User.find().select('-password').lean()
    if (!users) {
        return res.status(404).json({message : 'No users found'})
    }
    res.json(users)
})

const createNewUser = asyncHandler(async(req,res) => {
    const {username, password, roles} = req.body

    //confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message : 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await User.findOne({username}).lean().exec()
})

const updateUser = asyncHandler(async(req,res) => {

})

const deleteUser = asyncHandler(async(req,res) => {

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}












