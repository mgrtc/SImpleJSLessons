const express = require("express");
const test = require("./labs/testLab1.js");
const hash = require("./myModules/hash.js");
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.use(function (req ,res, next) { //in order for the backend server to receive http requests from your front end server, you must set up the headers to allow access from either
    // all domains "*", or just from your front end server, which should be "localhost" on port 3000.
    res.setHeader("Access-Control-Allow-Origin", "*");
    //res.setHeader("Access-Control-Allow-Credentials", "true");
    //res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
app.post("/requestLab", (request, response) => {
    console.log(request.body);
    var data = test();
    response.send(data);
});
app.post("/postLab", (request, response) => {
    var hashData = {
        hash : hash(request.body),
        data : request.body
    };
    console.log(hashData.data);
});

app.listen(3000,() => console.log("Server listening at port 3000"));