const TodoItem = require("../models/todo-item.model");
const errors = require("../../lib/error").getErrorData("todo");

// Sort todos using todo_item_index
const sortTodos = todos => {
    "use strict";
    return todos.sort((a, b) => a.todo_item_index - b.todo_item_index);
};

// Check if todo exists.
const checkIds = (res, todoIds, get) => {
    "use strict";
    return TodoItem.find({ "_id": { $in: todoIds } })
        .then(todos => {
            if (todos.length) {
                for (const todoId of todoIds) {
                    if (!todos.map(t => t._id.toString()).includes(todoId)) {
                        // Returning an error of can not find a task for any given id.
                        res.status(404).json(errors.TASK_404_ID);
                        return false;
                    }
                }
                if (get) {
                    return todos;
                }
                return true;
            }
            res.status(404).json(errors.TASK_404_ID);
            return false;
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                res.status(404).json(errors.TASK_404_ID);
                return false;
            }
            res.status(500).json(errors.TASK_500_RETRIEVE);
            return false;
        });
};

// Get todos by id.
const getTodos = (res, userId) => {
    "use strict";

    // Get the task for the given id.
    return TodoItem.find({ todo_item_user_id: userId })
        .then(todos => {
            if (!todos.length) {
                res.status(404).json(errors.TASK_404_ID);
                return false;
            }
            return sortTodos(todos).map(t => {
                return {
                    _id: t._id.toString(),
                    todo_item_index: t.todo_item_index
                };
            });
        })
        .catch(err => {
            res.status(500).json(errors.TASK_500_RETRIEVE);
            return false;
        });
};

// Update indexes of given tasks.
const updateIndexes = async (res, todos) => {
    "use strict";
    let successCount = 0;
    for (const todo of todos) {

        // eslint-disable-next-line no-await-in-loop
        const response = await TodoItem.findByIdAndUpdate(
            todo._id,
            { todo_item_index: todo.todo_item_index },
            { new: true, omitUndefined: true })
            .then((newTodos) => {
                return newTodos;
            })
            .catch(err => {
                res.status(500).json(errors.TASK_500_UPDATE_INDEX);
                return false;
            });
        if (!response) {
            return false;
        }

        successCount++;
    }

    if (todos.length > successCount) {
        res.status(500).json(errors.TASK_500_UPDATE_INDEX);
        return false;
    }
    return true;
};

const checkStatusString = (res, string) => {
    "use strict";
    const status_enum = TodoItem.schema.obj.todo_item_status_string.enum;
    if (string && !status_enum.includes(string)) {
        res.status(403).json(errors.TASK_403_INVALID_STATUS_STR);
        return false;
    }
    return true;
};

// Add tasks.
exports.addBulk = (req, res) => {
    "use strict";

    const user_id = req.user._id;
    const todosData = req.body;

    // Get indexes from existing tasks.
    TodoItem.find({ todo_item_user_id: req.user._id })
        .then(existingTodos => {

            // Setting user id for tasks. Because they were sent separately from the front.
            const todosToInsert = [];
            let iteration = existingTodos.length + 1;
            for (const todo of todosData) {
                if (!checkStatusString(res, todo.todo_item_status_string)) {
                    return;
                }
                todo.todo_item_user_id = user_id;
                todo.todo_item_index = iteration;
                todosToInsert.push(todo);
                iteration++;
            }

            // Save tasks to db if everything is ok.
            TodoItem.insertMany(todosToInsert)
                .then(response => {
                    res.status(200).json(sortTodos(response));
                })
                .catch(err => {
                    res.status(500).json(errors.TASK_500_CREATE);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(errors.TASK_500_RETRIEVE);
        });
};

// Update task.
exports.updateBulk = async (req, res) => {
    "use strict";

    const todosData = req.body;
    const updatedTodos = [];

    // Check if existing tasks with given task ids exist.
    if (await checkIds(res, todosData.map(t => t._id))) {

        for (const todoData of todosData) {
            if (!checkStatusString(res, todoData.todo_item_status_string)) {
                return;
            }
        }

        for (const todoData of todosData) {
            // Creating tasks for update with correct signature.
            const todoToUpdate = {
                todo_item_name: todoData.todo_item_name,
                todo_item_description: todoData.todo_item_description,
                todo_item_status: todoData.todo_item_status,
                todo_item_status_string: todoData.todo_item_status_string
            };

            // Updating tasks if everything is ok. Await for process to finish and return response.
            let updatedTodo = await TodoItem.findByIdAndUpdate(todoData._id, todoToUpdate, { new: true, omitUndefined: true })
                .then(task => {
                    return task;
                })
                .catch(err => {
                    return res.status(500).json(errors.TASK_500_UPDATE);
                });

            // Push updatedTask to an array to send back to front.
            updatedTodos.push(updatedTodo);
        }

        res.status(200).json(updatedTodos);
    }

};

// Get one task.
exports.get = (req, res) => {
    "use strict";

    const id = req.query.todo_item_id;
    if (!id){
        return res.status(403).json(errors.TASK_403_EMPTY_ID);
    }

    TodoItem.findById(id)
        .then(task => {
            if (!task) {
                return res.status(404).json(errors.TASK_404_ID);
            }
            res.status(200).json(task);
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).json(errors.TASK_404_ID);
            }
            return res.status(500).json(errors.TASK_500_RETRIEVE);
        });
};

// Get all tasks.
exports.getAll = (req, res) => {
    "use strict";

    // Find all task.
    TodoItem.find({ todo_item_user_id: req.user._id })
        .then(tasks => {
            res.status(200).json(sortTodos(tasks));
        })
        .catch(err => {
            res.status(500).json(errors.TASK_500_RETRIEVE);
        });
};

// Delete tasks.
exports.deleteBulk = async (req, res) => {
    "use strict";

    const todoIds = req.body;

    if (!Array.isArray(todoIds)) {
        return res.status(403).json(errors.TASK_403_INVALID_DATA);
    }

    if (todoIds.length === 0) {
        return res.status(403).json(errors.TASK_403_EMPTY_IDS);
    }

    for (const todoId of todoIds) {
        if (!todoId) {
            return res.status(403).json(errors.TASK_403_EMPTY_ID);
        }
    }

    // Check if all given ids are matching existing tasks ids.
    if (await checkIds(res, todoIds)) {

        // Fetching tasks.
        const resGet = await getTodos(res, req.user._id);
        if (resGet) {
            // Create a copy of sorted related tasks without given tasks.
            const fetchedTodos = sortTodos(resGet.filter(t => !todoIds.includes(t._id)));
            // Setting indexes of related tasks.
            fetchedTodos.forEach((t, index) => {
                t.todo_item_index = index + 1;
            });

            // Delete tasks if found.
            TodoItem.deleteMany({ "_id": { $in: todoIds } })
                .then(async resDel => {

                    // Update the indexes of related tasks after deleting.
                    if (await updateIndexes(res, fetchedTodos)) {

                        // Check if no: of deleted tasks equal given tasks.
                        if (resDel.deletedCount !== todoIds.length) {
                            res.status(500).json(errors.TASK_500_DELETE);
                        }

                        res.status(200).json({ success: true, message: "Todo item deleted successfully." });

                    }

                })
                .catch(err => {
                    res.status(500).json(errors.TASK_500_DELETE);
                });
        }
    }

};

// Change status.
exports.changeStatus = async (req, res) => {
    "use strict";

    const taskIds = req.body.todo_item_ids;
    if (taskIds.length === 0) {
        return res.status(403).json(errors.TASK_404_IDS);
    }

    // Check if all given ids are matching existing tasks ids.
    if (await checkIds(res, taskIds)) {
        // Update task states if everything is okay.
        TodoItem.updateMany({ "_id": { $in: taskIds } },
            {
                todo_item_status: req.body.todo_item_status,
                todo_item_status_string: req.body.todo_item_status_string
            })
            .then(response => {
                if (response.nModified === taskIds.length) {
                    res.status(200).json({ success: true, message: "Status changed successfully." });
                } else {
                    res.status(500).json(errors.TASK_500_UPDATE_STATUS);
                }
            })
            .catch(err => {
                res.status(500).json(errors.TASK_500_UPDATE_STATUS);
            });
    }
};

// Change status.
exports.changeIndexes = async (req, res) => {
    "use strict";

    const tasks = sortTodos(req.body);

    let ids = [];
    let indexes = [];
    for (const task of tasks) {

        if (!task._id) {
            return res.status(403).json(errors.TASK_403_EMPTY_ID);
        }

        if (!task.todo_item_index) {
            return res.status(403).json(errors.TASK_403_EMPTY_INDEX);
        }

        if (task.todo_item_index === 0) {
            return res.status(403).json(errors.TASK_403_INVALID_INDEX_0);
        }

        if (ids.includes(task._id)) {
            return res.status(403).json(errors.TASK_403_DUPLICATE_ID);
        }

        if (indexes.includes(task.todo_item_index)) {
            return res.status(403).json(errors.TASK_403_DUPLICATE_INDEX);
        }

        ids.push(task._id);
        indexes.push(task.todo_item_index);
    }

    // Check if all given ids are matching existing tasks ids.
    if (await checkIds(res, tasks.map(t => t._id))) {

        // Fetching related tasks to given task ids.
        const fetchedTasks = await getTodos(res, req.user._id);

        if (fetchedTasks) {

            if (fetchedTasks.length !== tasks.length) {
                return res.status(403).json(errors.TASK_403_INVALID_INDEX_COUNT);
            }

            let counter = 1;
            for (const task of tasks) {

                if (task.todo_item_index > fetchedTasks.length) {
                    return res.status(403).json(errors.TASK_403_INVALID_INDEX_HIGH);
                }

                if (task.todo_item_index !== counter) {
                    return res.status(403).json(errors.TASK_403_INVALID_INDEX_GAP);
                }

                counter++;
            }

            // Update the indexes of tasks.
            const updatedTasks = await updateIndexes(res, tasks);
            if (updatedTasks) {
                res.status(200).json(tasks);
            }
        }
    }

};
