const { Thought, User } = require('../models/user');

module.exports = {
    // get all thoughts '/api/thoughts'
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    // get thought by ID '/api/thoughts/:thoughtId'
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .populate('reactions')
            .then((thought) =>
                !thought ? res.status(404).json({ message: 'No thought of that id exists' }) : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // create new thought Post '/api/thoughts/'
    createThought(req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { thoughts: _id } }, {new:true});
            })
            .then((data) => {
                if (!data) {
                    res.status(404).json({ message: 'user not found' });
                    return;
                }
                res.json(data);
            })
            .catch((err) => res.json(err));
    },
    // Update a thought PUT '/api/thoughts/:thoughtId'
    updateThought(req, res) {
        Thought.updateOne({ _id: req.params.thoughtId }, req.body, {new:true})
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    // Delete a thought DELETE '/api/thoughts/:thoughtId'
    deleteThought(req, res) {
        Thought.deleteOne({ _id: req.params.thoughtId })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    // Create a reaction POST '/api/thoughts/:thoughtId/reactions'
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, { $push: { reactions: req.body } }, {new:true})
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    // Delete a reaction DELETE '/api/thoughts/:thoughtID/reactions/:reactionId'
    deleteReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { _id: req.params.reactionId } } }, {new:true})
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    }
};
