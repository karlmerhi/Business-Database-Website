/*********************************************************************************
 * WEB322 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically
 * from any other source (including 3rd party web sites) or distributed to other students.
 *
 * Name: KARL MERHI
 * Student ID: 150828168
 * Date: 11/06/2021
 *
 * Online (Heroku) Link: https://aqueous-peak-42879.herokuapp.com/
 *
 ********************************************************************************/

 const dataService = require("./data-service.js");
const multer = require("multer");
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");

var app = express();
app.use(express.static('public')); //to recognize the css files
app.use(express.urlencoded({ extended: true }));

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.engine('.hbs',
  exphbs({extname: '.hbs',
    helpers: {
      navLink: function (url, options) {
        return "<li" + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      }
    }
  })
);
app.set('view engine', '.hbs');

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

const imgPath = "/public/images/uploaded";

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, imgPath))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });
// prepares to receive the file
app.post("/images/add", upload.single("imageFile"), function (req, res) {
  res.redirect("/images");
});
//---------------------------------------------------------------------------
app.get("/images", function (req, res) {
  fs.readdir(path.join(__dirname, imgPath), function (err, items) {

    var obj = { images: [] };
    var size = items.length;
    for (var i = 0; i < items.length; i++) {
      obj.images.push(items[i]);
    }
    //res.json(obj);
    //console.log(obj);
    res.render("images",obj);
  });
});
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.render(path.join(__dirname, "/views/home.hbs"));
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  res.render(path.join(__dirname, "/views/about.hbs"));
});

// setup another route to listen on /about
app.get("/departments", function (req, res) {
  dataService
    .getDepartments()
    .then((data) => {
      res.render("departments", {departments: data});
    })
    .catch(() => {
      res.render("employees", { message: "no results" });
    });
});

app.get("/employees", function (req, res) {
  if (req.query.status) {
    dataService
      .getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch(() => {
        res.render("employees", { message: "no results" });
      });
  } else if (req.query.department) {
    dataService
      .getEmployeesByDepartment(req.query.department)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch(() => {
        res.render("employees", { message: "no results" });
      });
  } else if (req.query.manager) {
    dataService
      .getEmployeesByManager(req.query.manager)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch(() => {
        res.render("employees", { message: "no results" });
      });
  } else {
    dataService
      .getAllEmployees()
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch(() => {
        res.render("employees", { message: "no results" });
      });
  }
});

// setup another route to listen on /about
app.get("/employees/add", function (req, res) {
  res.render(path.join(__dirname, "/views/addEmployee.hbs"));
});

app.post("/employees/add", function (req, res) {
  dataService
    .addEmployee(req.body)
    .then((data) => {
      res.redirect("/employees");
    })
    .catch(() => {
      res.render("employees", { message: "no results" });
    });
});

app.get("/employee/:empNum", function (req, res) {
  dataService
    .getEmployeeByNum(req.params.empNum)
    .then((data) => {
      res.render("employee", { employee: data });
    })
    .catch(() => {
      res.render("employee",{message:"no results"});
    });
});

app.post("/employee/update", (req, res) => {
  dataService.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
  })
  .catch(() => {
    res.render("employee",{message:"no results"});
  });
});

app.get("/images/add", function (req, res) {
  res.render(path.join(__dirname, "/views/addImage.hbs"));
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
