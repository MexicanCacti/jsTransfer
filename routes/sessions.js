const express = require("express");
const router = express.Router()
const sessionsController = require("../controllers/sessions_controller");

router.post('/sessions', sessionsController.login);
router.delete('/sessions', sessionsController.logout);

module.exports = router;