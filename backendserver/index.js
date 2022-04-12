const express = require("express");
const test = require("./labs/testLab1.js");
const app = express();

app.use(function (req ,res, next) { //in order for the backend server to receive http requests from your front end server, you must set up the headers to allow access from either
    // all domains "*", or just from your front end server, which should be "localhost" on port 3000.
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get("/requestLab", (request, response) => {
    var data = test();
    response.send(data);
});

app.listen(3000,() => console.log("Server listening at port 3000"));