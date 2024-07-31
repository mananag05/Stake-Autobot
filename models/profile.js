const mongoose = require("mongoose")

const UserModel = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
        required: true,
    },
    balance : {
        type: Number,
        required: true,
        default: 10.0,
    },
})

const UsersCollection = mongoose.model("users" , UserModel);
module.exports = UsersCollection