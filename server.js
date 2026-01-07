const express = require('express');
const mongoose = require('mongoose');
const mongoDBURL = "mongodb://localhost:27017/test";

const app = express();
const uploadRoute = require('./routes/upload.js');
const registerRoute = require('./routes/register.js');
const port = 3000; //Note update to get from .env file

app.use(express.json())
app.use(express.static('public'))
app.use(uploadRoute)
app.use(registerRoute);

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