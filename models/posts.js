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
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Post', PostSchema);