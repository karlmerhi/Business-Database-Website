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
  return new Promise((resolve, reject) => {
    var temp_manager = employees.filter(
      (employee) => employee.isManager == true
    );
    if (temp_manager.length == 0) {
      reject("no results returned");
    }
    resolve(temp_manager);
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

module.exports.addEmployee = (employeeData) => {
  return new Promise((resolve, reject) => {
    employeeData.employeeNum = employees.length + 1;
    employees.push(employeeData);
    if (typeof employeeData.isManager == undefined) {
      employeeData.isManager = false;
    } else {
      employeeData.isManager = true;
    }
    resolve(employees);
  });
};

module.exports.getEmployeesByStatus = (status) => {
  return new Promise((resolve, reject) => {
    var temp_status = employees.filter((employee) => employee.status == status);
    if (temp_status.length == 0) {
      reject("no results returned");
    }
    resolve(temp_status);
  });
};

module.exports.getEmployeesByDepartment = (department) => {
  return new Promise((resolve, reject) => {
    var temp_department = employees.filter(
      (employee) => employee.department == department
    );
    if (temp_department.length == 0) {
      reject("no results returned");
    }
    resolve(temp_department);
  });
};

module.exports.getEmployeesByManager = (manager) => {
  return new Promise((resolve, reject) => {
    var temp_manager = employees.filter(
      (employee) => employee.employeeManagerNum == manager
    );
    if (temp_manager.length == 0) {
      reject("no results returned");
    }
    resolve(temp_manager);
  });
};

module.exports.getEmployeeByNum = (num) => {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].employeeNum == num) {
        tempEmp = employees[i];
        i = employees.length;
      }
    }
    if (tempEmp === "undefined") {
      reject("no results returned");
    }
    resolve(tempEmp);
  });
};

module.exports.updateEmployee = (employeeData) => {
  var found = false;
  return new Promise((resolve, reject) => {
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].employeeNum == employeeData.employeeNum) {
        employees[i] = employeeData;
        found = true;
      }
    }
    if (found === false) {
      reject("no results returned");
    }
    resolve(employees);
  });
};
