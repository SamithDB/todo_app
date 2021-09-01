const router = require("express").Router();

router.use("/auth", require("./auth.routes.js"));

module.exports = router;