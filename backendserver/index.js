const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require("express");
const mongoose = require("mongoose");
const lessonModel = require("./model");
const hash = require("./myModules/hash/hash.js");
const database = require("./myModules/map/dataBaseMap.js")();
const bodyParser = require('body-parser');
const { json } = require('express/lib/response');
const app = express();

//in order for https to work when running it on your local machine. You must create your own ssl cert. ASP.net requires https for fetch() api
//!IMPORTANT: https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node

var privateKey  = fs.readFileSync('./key.pem', 'utf8');
var certificate = fs.readFileSync('./cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);

mongoose.connect('mongodb://localhost:27017/usersdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(bodyParser.json({
    limit : '1mb'
}));

app.use(function (req ,res, next) { //in order for the backend server to receive http requests from your front end server, you must set up the headers to allow access from either
    // all domains "*", or just from your front end server, which should be "localhost" on port 3000.
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Contr~ol-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept",  "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
app.post("/requestLab", (request, response) => {
    var hash = request.body.labID;
    lessonModel.findOne({lessonHash:hash}, function(error, data){
        if(data){
            console.log(data);
            console.log("lesson found!");
            response.send(data.lessonData);
        }else{
            response.send({
                error : "error reqesting data"
            });
        }
    });
});
app.post("/postLab", (request, response) => {
    console.log("postLab requested..")
    var newData = {
        lessonHash : hash(JSON.stringify(request.body)),
        lessonData : request.body
    };
    var newLesson = lessonModel(newData);
    lessonModel.findOne({lessonHash:newData.lessonHash}, function(error, data){
        if(data){
            console.log(data.lessonData);
            console.log("lesson already exists!");
        }else{
            newLesson.save(newData);
        }
    });
    var newURL = {
        URL : "/sandbox.html?labID=" + newData.lessonHash
    }
    console.log("somethings happening...");
    response.send(newURL);
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
httpsServer.listen(8443);