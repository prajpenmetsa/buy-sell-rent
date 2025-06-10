const mongoose = require("mongoose")

const UserdataSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    contactNumber: String,
    password: String,
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'itemdata' }]
});

const userdataModel = mongoose.model('userdata', UserdataSchema);
module.exports = userdataModel;
