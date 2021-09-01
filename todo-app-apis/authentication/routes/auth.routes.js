const router = require("express").Router();
const auth = require("../controllers/auth.controller");

// For Registration
router.post("/signup", auth.signup);

// For Login Process
router.post("/login", auth.login);

module.exports = router;