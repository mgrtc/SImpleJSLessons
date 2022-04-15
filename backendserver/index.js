const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require("express");
const hash = require("./myModules/hash/hash.js");
const database = require("./myModules/map/dataBaseMap.js")();
const bodyParser = require('body-parser');
const app = express();

//in order for https to work when running it on your local machine. You must create your own ssl cert. ASP.net requires https for fetch() api
//!IMPORTANT: https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node

var privateKey  = fs.readFileSync('./key.pem', 'utf8');
var certificate = fs.readFileSync('./cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);

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
    var fileName = database.getMap(hash);
    if(fileName){
        fs.readFile(fileName, function(error, data){
            if(error){
                console.log("request read error");
                response.end();
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
    var body = request.body;
    if((new TextEncoder().encode(JSON.stringify(body))).length > 5000){
        response.send({
            URL : "file limit exceed..."
        });
    }
    var hashData = {
        hash : hash(JSON.stringify(request.body)),
        data : request.body
    };
    database.setMap(hashData.hash, hashData.data);
    var newURL = {
        URL : "/sandbox.html?labID=" + hashData.hash
    }
    console.log("somethings happening...");
    response.send(newURL);
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
httpsServer.listen(8443);