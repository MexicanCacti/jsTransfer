require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const app = express();
const requireLogin = require("./middleware/auth");
const downloadRoute = require('./routes/download.js');
const filesRoute = require('./routes/files.js');
const searchRoute = require('./routes/search.js');
const sessionsRoute = require('./routes/sessions.js');
const uploadRoute = require('./routes/upload.js');
const usersRoute = require('./routes/users.js');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
const mongoDBURL = process.env.MONGODB_URL;


app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(
    session({
        name: 'fileshare.sid',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoDBURL,
        }),
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);


app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})

app.use(sessionsRoute);
app.use(usersRoute);

app.use("/upload", requireLogin, uploadRoute);
app.use("/download", requireLogin, downloadRoute);
app.use("/files", requireLogin, filesRoute);
app.use("/search", requireLogin, searchRoute);


app.get('/', (req, res) => {
    if (req.session.user_id) {
        return res.redirect("/download");
    }
    res.render('login', { error: null, success: null });
});

app.get('/login', (req, res) => {
    if (req.session.user_id) {
        return res.redirect("/download");
    }
    res.render("login", { error: null, success: null });
});

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('MongoDB connection successful');
        app.listen(port, host, (err) => {
            if (err) console.error(err);
            else console.log(`Server running at http://${host}:${port}`);
        });
    })
    .catch((err) => console.error('MongoDB connection error:', err));

module.exports = app;