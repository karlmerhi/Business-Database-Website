/*********************************************************************************
 * WEB322 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically
 * from any other source (including 3rd party web sites) or distributed to other students.
 *
 * Name: KARL MERHI
 * Student ID: 150828168
 * Date: 12/01/2021
 *
 * Online (Heroku) Link: https://aqueous-peak-42879.herokuapp.com/
 *
 ********************************************************************************/

const dataService = require("./data-service.js");
const dataServiceAuth = require("./data-service-auth.js");
const clientSessions = require("client-sessions");
const multer = require("multer");
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
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

app.use(express.static("public")); //to recognize the css files
app.use(express.urlencoded({ extended: true }));

app.use(
  clientSessions({
    cookieName: "session",
    secret: "web322_a6",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// This is a helper middleware function that checks if a user is logged in
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

app.use((req, res, next) => {
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
app.get("/", (req, res) => {
  res.render("home");
});

// setup another route to listen on /about
app.get("/about", (req, res) => {
  res.render("about");
});

// image routes
app.get("/images", ensureLogin, (req, res) => {
  fs.readdir(imgPath, (err, items) => {
    res.render("images", { images: items });
  });
});

app.get("/images/add", ensureLogin, (req, res) => {
  res.render("addImage");
});

app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

//employee routes
app.get("/employees", ensureLogin, (req, res) => {
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

app.get("/employees/add", ensureLogin, (req, res) => {
  dataService
    .getDepartments()
    .then((data) => {
      res.render("addEmployee", { departments: data });
    })
    .catch((err) => {
      res.render("addEmployee", { departments: [] });
    });
});

app.post("/employees/add", ensureLogin, (req, res) => {
  dataService
    .addEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err) => {
      res.render("employees", { message: "no results" });
    });
});

app.post("/employee/update", ensureLogin, (req, res) => {
  dataService
    .updateEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err) => {
      res.status(500).send("Unable to Update Employee");
    });
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
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

app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
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
app.get("/departments", ensureLogin, (req, res) => {
  dataService
    .getDepartments()
    .then((data) => {
      res.render("departments", { departments: data });
    })
    .catch((err) => {
      res.render("departments", { message: "no results" });
    });
});

app.get("/departments/add", ensureLogin, (req, res) => {
  res.render("addDepartment");
});

app.post("/departments/add", ensureLogin, (req, res) => {
  dataService
    .addDepartment(req.body)
    .then(() => {
      res.redirect("/departments");
    })
    .catch((err) => {
      res.render("departments", { message: "no results" });
    });
});

app.post("/department/update", ensureLogin, (req, res) => {
  dataService
    .updateDepartment(req.body)
    .then(() => {
      res.redirect("/departments");
    })
    .catch((err) => {
      res.render("departments");
    });
});

app.get("/department/:departmentId", ensureLogin, (req, res) => {
  dataService
    .getDepartmentById(req.params.departmentId)
    .then((data) => {
      res.render("department", { department: data });
    })
    .catch((err) => {
      res.status(404).send("Department Not Found");
    });
});

app.get("/departments/delete/:departmentId", ensureLogin, (req, res) => {
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

// login routes

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");

  dataServiceAuth
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName, // authenticated user's userName
        email: user.email, // authenticated user's email
        loginHistory: user.loginHistory, // authenticated user's loginHistory
      };
      res.redirect("/employees");
    })
    .catch((err) => {
      res.render("login", { errorMessage: err, userName: req.body.userName });
    });
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

// register routes

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  dataServiceAuth
    .registerUser(req.body)
    .then(() => {
      res.render("register", { successMessage: "User created" });
    })
    .catch((err) => {
      res.render(
        "register",
        res.render("register", {
          errorMessage: err,
          userName: req.body.userName,
        })
      );
    });
});

// user history

app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory");
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

dataService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("app listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start server: " + err);
  });

dataServiceAuth
  .initialize()
  .then(dataServiceAuth.initialize)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("app listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start server: " + err);
  });

//app.listen(HTTP_PORT, onHttpStart);
