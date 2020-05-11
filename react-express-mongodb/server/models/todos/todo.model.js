/**
 * Created by Syed Afzal
 */
const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text : {
        type: String,
        trim: true,
        required: true
    }
});

module.exports = {Todo};
