/**
 * Created by Syed Afzal
 */
const mongoose = require('mongoose');

const JobApp = mongoose.model('JobApp', new mongoose.Schema({
    text : {
        type: String,
        trim: true,
        required: true
    },
    whenApplied : {
        type: Date,
        default: Date.now
    },
    from : {
        type: String,
        trim: true,
        required: true
    },
    description : {
        type: String,
        trim: true,
        default: 'Brak.'
    }
}));

module.exports = {JobApp};
