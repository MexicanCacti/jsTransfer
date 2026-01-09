require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const uploadRoute = require('./routes/upload.js');
const downloadRoute = require('./routes/download.js');
const searchRoute = require('./routes/search');
const requireLogin = require("./middleware/auth");
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
const mongoDBURL = process.env.MONGODB_URL

app.use(express.json())
app.use(express.static('public'))

app.use(session({
    name: "fileshare.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    }),
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));



app.use("/upload", requireLogin, uploadRoute);
app.use("/download", requireLogin, downloadRoute);
app.use("/search", requireLogin, searchRoute);
app.use("/files", requireLogin);

app.set("view engine", "ejs");

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("Connection Successful")

        app.listen(port, host, (error) =>{
            if (error)
                console.log(error);
            else
                console.log("OK!")
        });
    })
    .catch((err) => console.error("Connection Error:", err));

app.get("/", (req, res) => {
    res.render("login")
})

app.get("/upload", (req, res) => {
    res.render("upload", {
        error: null,
        success: null
    });
})

app.get("/download", (req, res) => {
    res.render("download");
})

app.get("/login", (req, res) => {
    res.render("login");
})

module.exports = app;