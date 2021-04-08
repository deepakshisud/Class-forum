const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Post = require('./models/posts');

mongoose.connect('mongodb://localhost:27017/class-forum', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, '/views'));
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', async(req, res) => {
    const posts = await Post.find({});
    res.render('home', {posts});
})

app.listen(3000, () => {
    console.log("connected on port 3000");
})