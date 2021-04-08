const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    heading: {
        required: true,
        type: String
    },
    text: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('Post', PostSchema);