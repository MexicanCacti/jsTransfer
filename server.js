const express = require('express');

const app = express();
const uploadRoute = require('./routes/upload.js');
const registerRoute = require('./routes/register.js');
const port = 3000; //Note update to get from .env file

app.use(express.json())
app.use(uploadRoute)
app.use(registerRoute);

app.get('/', (req, res) => {
    res.send('Main Page');
})

app.listen(port, (error) =>{
    if (error)
        console.log(error);
    else
        console.log("OK!")
})

module.exports = app;