const uuid = require('uuid');
const { validationResult } = require('express-validator');

const error = require('../models/http-error');
const User = require('../models/user');
const HttpError = require('../models/http-error');

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

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new error("Check your input. Some data is invalid.", 422));
    }
    const { userName, password, email, places } = req.body;

    let usedEmail;
    try {
        usedEmail = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Would not sign you up at this time. Please try again later.", 500);
        return next(error);
    };

    if (usedEmail) {
        const error = new HttpError('Account already exists for this email. Please login.', 422);
        return next(error);
    }

    const newUser = new User({ userName, password, email, image: 'https://unsplash.com/photos/QS4KxdelN_4', places });

    try {
        await newUser.save();
    } catch (err) {
        const error = new HttpError("Could not save new sign up data. Please try again later.", 500);
        return next(error);
    };

    res.status(201).json({ users: newUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let user;
    try {
        user = await User.findOne({email: email, password: password});
    } catch (err) {
        const error = new HttpError("Could not login. Please try agin later.");
        return next(error);
    };
    if (!user) {
        return next(new error("Email or password incorrect", 401));
    }
    res.json({ user: user.toObject({getters: true}).email });
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;