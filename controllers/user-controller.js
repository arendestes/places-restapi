const uuid = require('uuid');

const error = require('../models/http-error');

let DUMMY_USERS = [
    {
        id: 'u1',
        userName: "Clark Kent",
        password: "Krypton",
        email: "cKent@dailyplanet.com"
    }
];

const getUsers = (req, res, next) => {
    res.json({ message: DUMMY_USERS });
};

const signup = (req, res, next) => {
    const {userName, password, email} = req.body;
    const alreadyUser = DUMMY_USERS.find(user => user.email === email);
    if (alreadyUser){
        res.json({message: 'There is already an account with this password.'});
    }
    const newUser = {userName, password, email, id: uuid.v4()};
    DUMMY_USERS.push(newUser);
    res.status(201).json({ users:  DUMMY_USERS});
};

const login = (req, res, next) => {
    const {email, password} = req.body;
    const user = DUMMY_USERS.find(user => email === user.email && password === user.password);
    if(!user){
        return next(new error("Email or password incorrect", 401));
    }
    res.json({ user: user });
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;