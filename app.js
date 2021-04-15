const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');
const Post = require('./models/posts');
const session = require('express-session');
const {isLoggedIn} = require('./middleware');

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

const sessionConfig = {
    secret: 'asecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get('/register', (req, res) => {
    res.render('users/register');
})

app.post('/register', async(req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) next(err);
            res.redirect('/home');
        });
    } catch(e) {
        res.redirect('register');
    }
})

app.get('/login', (req, res) => {
    res.render('users/login');
})

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), async(req, res) => {
    const redirectUrl = req.session.returnTo || '/home';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})



app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/home');
})

app.get('/home', async(req, res) => {
    const posts = await Post.find({});
    res.render('home', {posts});
})

app.get('/new', isLoggedIn, (req, res) => {
    res.render('new');
})

app.post('/new', async(req, res) => {
    const post = new Post(req.body.post);
    await post.save();
    res.redirect('/home');
})

app.get('/:id', async(req, res) => {
    const post = await Post.findById(req.params.id);
    if(!post) {
        return res.redirect('/home');
    }
    res.render('show', {post});
})

app.listen(3000, () => {
    console.log("connected on port 3000");
})