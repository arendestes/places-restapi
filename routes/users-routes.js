const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/user-controller')

const router = express.Router();

router.get('/', userControllers.getUsers);

router.post('/signup', [
    check('email')
        .normalizeEmail()
        .isEmail(),
    check("password")
        .isLength({ min: 8 }),
    check('userName')
        .notEmpty()
], userControllers.signup);

router.post('/login', userControllers.login)

module.exports = router;