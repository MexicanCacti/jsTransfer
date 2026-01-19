const express = require("express");
const router = express.Router()
const usersController = require("../controllers/users_controller");

router.post('/users', usersController.register);

module.exports = router;