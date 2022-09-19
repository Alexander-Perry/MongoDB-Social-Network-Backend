const { Schema, model } = require('mongoose');

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
            getters:true
        },
        id: false
    }
);
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
        getters:true
    },
    id: false,
})



userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length
    });

thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length
    });

const User = model('User', userSchema)
const Thought = model('Thought', thoughtSchema)


// user
// Schema Settings:
// Create a virtual called friendCount that retrieves the length of the user's friends array field on query.

//thought
// Schema Settings:
// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.

//reaction
// Schema Settings:
// This will not be a model, but rather will be used as the reaction field's subdocument schema in the Thought model.
// createdAt:     // Use a getter method to format the timestamp on query


module.exports = { User, Thought };