const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,63})?$/
        // regexp match:
        // [\w-\.] = a-z, A-Z, 0-9, _, -, . 
        // @([\w-] = @ + a-z,A-Z,0-9, _, -
        // [\w-]{2,63} = a-z,A-Z,0-9, _,- -,   {2,63} matches 2-63 times
        // upper length of 63 chars for support for new gTLD (https://newgtlds.icann.org/en/)
    }
})



// username
// String
// Unique
// Required
// Trimmed

// email
// String
// Required
// Unique
// Must match a valid email address (look into Mongoose's matching validation)

// thoughts
// Array of _id values referencing the Thought model

// friends
// Array of _id values referencing the User model (self-reference)

// Schema Settings:
// Create a virtual called friendCount that retrieves the length of the user's friends array field on query.