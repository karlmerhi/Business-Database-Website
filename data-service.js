const fs = require("fs");

employees = [];
departments = [];

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile("./data/employees.json", (err, data) => {
        if (err) throw err;
        employees = JSON.parse(data);
      });

      fs.readFile("./data/departments.json", (err, data) => {
        if (err) throw err;
        departments = JSON.parse(data);
      });
    } catch (e) {
      reject("Unable to read file");
    }
    resolve("File has been read successfully");
  });
};

module.exports.getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    if (employees.length > 0) {
      resolve(employees);
    } else {
      reject("No results returned");
    }
  });
};

module.exports.getManagers = () => {
  var managers = [];
  return new Promise( (resolve, reject) => {
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].isManager == true) managers.push(employees[i]);
    }

    if (managers.length == 0) {
        reject("No results returned");
    }
    resolve(managers);
  });
};

module.exports.getDepartments = () => {
  return new Promise((resolve, reject) => {
    if (departments.length > 0) {
      resolve(departments);
    } else {
      reject("No results returned");
    }
  });
};
