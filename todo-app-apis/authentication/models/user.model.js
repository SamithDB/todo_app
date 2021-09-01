const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
    user_first_name: { type: String, required: true },
    user_last_name: { type: String, required: true },
    user_username: { type: String, required: true, unique: true },
    user_password: { type: String, required: true },
    user_salt: { type: String, required: true },
    user_type: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },
    user_status: { type: Boolean, default: false },
    user_status_string: {
        type: String,
        enum: ["Active", "Pending", "Deactive"],
        default: "Active"
    }
}, {
    timestamps: true
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);