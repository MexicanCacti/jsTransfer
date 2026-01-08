require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoDBURL = process.env.MONGODB_URL

const app = express();
const uploadRoute = require('./routes/upload.js');
const downloadRoute = require('./routes/download.js');
const searchRoute = require('./routes/search');
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.static('public'))
app.use(uploadRoute)
app.use(downloadRoute);
app.use(searchRoute);

app.set("view engine", "ejs");

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("Connection Successful")

        app.listen(port, (error) =>{
            if (error)
                console.log(error);
            else
                console.log("OK!")
        });
    })
    .catch((err) => console.error("Connection Error:", err));

app.get("/", (req, res) => {
    res.render("index")
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

module.exports = app;