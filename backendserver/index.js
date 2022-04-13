const fs = require('fs');
const express = require("express");
const hash = require("./myModules/hash/hash.js");
const database = require("./myModules/map/dataBaseMap.js")();
const app = express();
const bodyParser = require('body-parser');

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
    var hash = request.body.labID;
    var fileName = database.getMap(hash);
    if(fileName){
        fs.readFile(fileName, function(error, data){
            if(error){
                return;
            }
            console.log(JSON.parse(data));
            response.send(JSON.parse(data));
        });
    }else{
        console.log("error retrieving data...")
        response.end();
    }
});
app.post("/postLab", (request, response) => {
    var hashData = {
        hash : hash(JSON.stringify(request.body)),
        data : request.body
    };
    database.setMap(hashData.hash, hashData.data);
    var newHash = {
        hash : "/sandbox.html?labID=" + hashData.hash
    }
    response.send(newHash);
});

app.listen(3000,() => console.log("Server listening at port 3000"));