const { User } = require('../models/user');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .then((user) =>
                !user ? res.status(404).json({ message: 'No user of that id exists' }) : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.updateOne({ _id: req.params.userId }, req.body)
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.deleteOne({ _id: req.params.userId })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
};
