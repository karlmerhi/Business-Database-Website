/*********************************************************************************
* WEB322 – Assignment 02
* I	declare	that this assignment is	my own work in accordance with Seneca Academic 
* Policy. No part of this assignment has been copied manually or electronically	
* from any other source	(including 3rd party web sites) or distributed to other students.
*	
* Name:	KARL MERHI Student ID: 150828168 Date:	10/03/2021
*
* Online (Heroku) Link:	________________________________________________________
*
********************************************************************************/	


var express = require("express");
var path = require("path");
var dataService = require("./data-service.js");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees", function (req, res) {
    dataService.getAllEmployees().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({mesage: err})
    });
});

app.get("/managers", function (req, res) {
    dataService.getManagers().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({mesage: err})
    });
});

// setup another route to listen on /about
app.get("/departments", function (req, res) {
    dataService.getDepartments().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({mesage: err})
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

dataService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);  //start the server 
    })
    .catch(err => {
        console.log(err);
    })
