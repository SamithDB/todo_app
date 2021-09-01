const router = require("express").Router();
const authenticate = require("passport").authenticate("jwt", { session: false });
const todo = require("../controllers/todo-item.controller");

// Add tasks.
router.post("/addTodos", authenticate, todo.addBulk);

// Update tasks.
router.put("/updateTodos", authenticate, todo.updateBulk);

// Get one tasks.
router.get("/get", authenticate, todo.get);

// Get all tasks for user.
router.get("/getAll", authenticate, todo.getAll);

// Delete tasks.
router.post("/deleteTodos", authenticate, todo.deleteBulk);

// Change status.
router.put("/changeStatus", authenticate, todo.changeStatus);

// Change index.
router.put("/changeIndexes", authenticate, todo.changeIndexes);

module.exports = router;