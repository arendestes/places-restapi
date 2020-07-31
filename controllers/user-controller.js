const uuid = require('uuid');
const { validationResult } = require('express-validator');

const error = require('../models/http-error');
const User = require('../models/user');

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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new error("Check your input. Some data is invalid.", 422);
    }
    const {userName, password, email} = req.body;
    const alreadyUser = DUMMY_USERS.find(user => user.email === email);
    if (alreadyUser){
        return next(new error("There is anyready an account with this email.", 422));
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