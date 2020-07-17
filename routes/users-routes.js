const express = require('express');

const userControllers = require('../controllers/user-controller')

const router = express.Router();

router.get('/', userControllers.getUsers);

module.exports = router;