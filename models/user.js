const { Schema, model } = require('mongoose');

// User Schema
const userSchema = new Schema({
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
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,63})?$/,
        // upper length of 63 chars to allow for new gTLD (https://newgtlds.icann.org/en/)
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);
// Reaction Schema (needs to be before Thought Schema)
const reactionSchema = new Schema({
    reactionID: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);
// Thought Schema
const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionSchema]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false,
})

//Virtuals - userSchema 
userSchema
    .virtual('friendCount')
    // get count of friends
    .get(function () {
        return this.friends.length
    });

// Virtuals - thoughtSchema
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        // get number of reactions
        return this.reactions.length
    });

// Create the documents
const User = model('User', userSchema)
const Thought = model('Thought', thoughtSchema)

module.exports = { User, Thought };