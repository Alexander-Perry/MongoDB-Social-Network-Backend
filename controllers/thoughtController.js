const { Thought, User } = require('../models/user');

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
            .then(({ _id }) => {
                return User.findOneAndUpdate({ _id: req.body.userId }, { $push: { thoughts: _id } });
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
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, { $push: { reactions: req.body } })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: req.params.reactionId } })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    }
};
