/*********************************************************************************
 * WEB322 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically
 * from any other source (including 3rd party web sites) or distributed to other students.
 *
 * Name: KARL MERHI
 * Student ID: 150828168
 * Date: 11/21/2021
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
app.use(express.static("public")); //to recognize the css files
app.use(express.urlencoded({ extended: true }));

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
  return new Promise((res, req) => {
    dataService
      .initialize()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  });
}

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);
app.set("view engine", ".hbs");

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

const imgPath = "./public/images/uploaded";

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: imgPath,
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

// deafault URL (http://localhost)
app.get("/", function (req, res) {
  res.render("home");
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  res.render("about");
});

// image routes
app.get("/images", (req, res) => {
  fs.readdir(imgPath, function (err, items) {
    res.render("images", { images: items });
  });
});

app.get("/images/add", function (req, res) {
  res.render("addImage");
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

//employee routes
app.get("/employees", function (req, res) {
  if (req.query.status) {
    dataService
      .getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  } else if (req.query.department) {
    dataService
      .getEmployeesByDepartment(req.query.department)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  } else if (req.query.manager) {
    dataService
      .getEmployeesByManager(req.query.manager)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  } else {
    dataService
      .getAllEmployees()
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  }
});

app.get("/employees/add", (req, res) => {
  dataService
    .getDepartments()
    .then((data) => {
      res.render("addEmployee", { departments: data });
    })
    .catch((err) => {
      res.render("addEmployee", { departments: [] });
    });
});

app.post("/employees/add", function (req, res) {
  dataService
    .addEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err) => {
      res.render("employees", { message: "no results" });
    });
});

app.post("/employee/update", (req, res) => {
  dataService
    .updateEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err) => {
      res.status(500).send("Unable to Update Employee");
    });
});

app.get("/employee/:empNum", (req, res) => {
  let viewData = {};

  dataService
    .getEmployeeByNum(req.params.empNum)
    .then((data) => {
      if (data) {
        viewData.employee = data;
      } else {
        viewData.employee = null;
      }
    })
    .catch(() => {
      viewData.employee = null;
    })
    .then(dataService.getDepartments)
    .then((data) => {
      viewData.departments = data;

      for (let i = 0; i < viewData.departments.length; i++) {
        if (
          viewData.departments[i].departmentId == viewData.employee.department
        ) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = [];
    })
    .then(() => {
      if (viewData.employee == null) {
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", { viewData: viewData });
      }
    });
});

app.get("/employees/delete/:empNum", (req, res) => {
  dataService
    .deleteEmployeeByNum(req.params.empNum)
    .then((data) => {
      res.redirect("/employees");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Employee / Employee not found)");
    });
});

//department routes
app.get("/departments", function (req, res) {
  dataService
    .getDepartments()
    .then((data) => {
      res.render("departments", { departments: data });
    })
    .catch((err) => {
      res.render("departments", { message: "no results" });
    });
});

app.get("/departments/add", function (req, res) {
  res.render("addDepartment");
});

app.post("/departments/add", function (req, res) {
  dataService
    .addDepartment(req.body)
    .then(() => {
      res.redirect("/departments");
    })
    .catch((err) => {
      res.render("departments", { message: "no results" });
    });
});

app.post("/department/update", (req, res) => {
  dataService
    .updateDepartment(req.body)
    .then(() => {
      res.redirect("/departments");
    })
    .catch((err) => {
      res.render("departments");
    });
});

app.get("/department/:departmentId", function (req, res) {
  dataService
    .getDepartmentById(req.params.departmentId)
    .then((data) => {
      res.render("department", { department: data });
    })
    .catch((err) => {
      res.status(404).send("Department Not Found");
    });
});

app.get("/departments/delete/:departmentId", (req, res) => {
  dataService
    .deleteDepartmentById(req.params.departmentId)
    .then((data) => {
      res.redirect("/departments");
    })
    .catch((err) => {
      res
        .status(500)
        .send("Unable to Remove Department / Department not found)");
    });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);
