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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Post', PostSchema);