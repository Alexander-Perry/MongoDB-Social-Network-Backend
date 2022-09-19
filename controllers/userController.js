const { User, Thought } = require('../models/user');

module.exports = {
    // get all users '/api/users/'
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // get single user '/api/users/:userId'
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .then((user) =>
                !user ? res.status(404).json({ message: 'No user of that id exists' }) : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // create User POST '/api/users/
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },
    // Update User details PUT '/api/users/:userId'
    updateUser(req, res) {
        User.updateOne({ _id: req.params.userId }, req.body, {new:true})
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    // delete User DELETE '/api/users/:userId'
    deleteUser(req, res) {
        const user = User.findOne({_id: req.params.userId})
        User.findOneAndDelete({ _id: req.params.userId })
            .then(({ username }) => { 
                // Delete associated Thoughts
            return Thought.deleteMany({username});
        })
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    // add Friend POST '/api/users/:userId/friends/:friendId'
    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, {new:true})
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
    // Remove Friend Delete '/api/users/:userId/friends/:friendId'
    removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, {new:true})
            .then((data) => res.json(data))
            .catch((err) => res.status(500).json(err));
    },
};
