const { Thought } = require('../models/user');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .populate('reactions')
            .then((thought) =>
                !thought ? res.status(404).json({ message: 'No thought of that id exists' }) : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        Thought.create(req.body)
            .User.findOneAndUpdat({ _id: req.body.userId }, { $addToSet: { thoughts: req.params.thoughtId } })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res) {
        Thought.updateOne({ _id: req.params.thoughtId }, req.body)
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.deleteOne({ _id: req.params.thoughtId })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    createReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.params.reactionId } })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: req.params.reactionId } })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    }
};
