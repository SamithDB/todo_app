const mongoose = require("mongoose");

const TodoItemSchema = new mongoose.Schema({
    todo_item_index: { type: Number, required: true },
    todo_item_name: { type: String, required: true },
    todo_item_description: { type: String , default: " " },
    todo_item_status: { type: Boolean, default: true },
    todo_item_status_string: {
        type: String,
        enum: ["Todo", "Inprogress", "Done"],
        default: "Todo"
    },
    todo_item_user_id: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("TodoItem", TodoItemSchema);

