/*********************************************************************************
 * WEB322 – Assignment 03
 * I declare that this assignment is my own work in accordance with Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically
 * from any other source (including 3rd party web sites) or distributed to other students.
 *
 * Name: KARL MERHI 
 * Student ID: 150828168 
 * Date: 10/14/2021
 *
 * Online (Heroku) Link: https://aqueous-peak-42879.herokuapp.com/
 *
 ********************************************************************************/

const multer = require("multer");
const express = require("express");
const path = require("path");
const dataService = require("./data-service.js");
const app = express();
const fs = require("fs");

app.use(express.static("public/css"));
app.use(express.urlencoded({ extended: true }));

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/managers", function (req, res) {
  dataService
    .getManagers()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

// setup another route to listen on /about
app.get("/departments", function (req, res) {
  dataService
    .getDepartments()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/employees", function (req, res) {
  if (req.query.status) {
    dataService
      .getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else if (req.query.department) {
    dataService
      .getEmployeesByDepartment(req.query.department)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else if (req.query.manager) {
    dataService
      .getEmployeesByManager(req.query.manager)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else {
    dataService
      .getAllEmployees()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
});

// setup another route to listen on /about
app.get("/employees/add", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

app.post("/employees/add", function (req, res) {
  dataService
    .addEmployee(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/employee/:value", function (req, res) {
    dataService
    .getEmployeeByNum(req.params.value)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/images/add", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), function (req, res) {
  res.redirect("/images");
});

app.get("/images", function (req, res) {
  fs.readdir(path.join(__dirname, "./public/images/uploaded"), function (err, items) {
    console.log(items);

    res.json(items);
  });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

dataService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart); //start the server
  })
  .catch((err) => {
    console.log(err);
  });
