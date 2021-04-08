const mongoose = require('mongoose');
const Post = require('../models/posts');
const helper = require('./seeds-helper');

mongoose.connect('mongodb://localhost:27017/class-forum', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random()*15)];

const seedDB = async() => {
    await Post.deleteMany({});
    for(let i=0; i<7; i++) {
        const post = new Post( {
            heading: `${sample(helper[0])} ${sample(helper[1])}`,
            text: "Quis eiusmod minim esse sit nulla ad occaecat mollit cillum. Est et quis labore do minim eu ad id. Sint duis proident ex reprehenderit labore officia dolore dolor quis ut laborum. Ea qui dolore pariatur duis est commodo amet laborum qui minim duis magna incididunt. Quis cupidatat ex Lorem sunt elit ea culpa. Id Lorem ea sint veniam nisi sunt. Enim amet anim sit sint sit ut quis aliquip."
        })
        await post.save();
    }

}

seedDB();