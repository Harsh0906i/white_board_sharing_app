let mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
    , presenter: {
        type: Boolean,
        required: true
    },
    roomId: {
        type: String,
    },

}, { timestamps: true });
const User = mongoose.model('Users', userSchema);
module.exports = User;