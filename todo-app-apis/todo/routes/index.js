const router = require("express").Router();

// All routes for task import here.
router.use("/todo", require("./todo-item.routes"));

module.exports = router;