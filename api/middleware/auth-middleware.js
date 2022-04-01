const Users = require('../users/users-model');

const validateUsername = async (req, res, next) => {
    try {
        const users = await Users.findBy({ username: req.body.username })
        if(!users.length) {
            next()
        } else next({  status: 401, message: 'username taken' })
    } catch (error) {
        next(error)
    }
};

const validateData = (req, res, next) => {
    const {username, password} = req.body;
    if(!username || !password) {
        res.status(400).json({ message: 'username and password required' })
    } else {
        next()
    }
};

module.exports = {
    validateUsername,
    validateData
}