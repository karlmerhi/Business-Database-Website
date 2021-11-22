const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "d4id6hdb8r0776",
  "wezqgnychcziak",
  "7cc50b81dc139af5eefa70945d51dc572ed4382b8a37f74f9bb83de697c79838",
  {
    host: "ec2-34-224-239-147.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

// Creating Data Models
const Employee = sequelize.define("Employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addresCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  matritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  hireDate: Sequelize.STRING,
});

const Department = sequelize.define("Department", {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  departmentName: Sequelize.STRING,
});

Department.hasMany(Employee, { foreignKey: "department" });

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to sync the database");
      });
    reject();
  });
};

module.exports.getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    Employee.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned.");
      });
  });
};

module.exports.getEmployeesByStatus = (status) => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        status: status,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned.");
      });
  });
};

module.exports.getEmployeesByDepartment = (department) => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        department: department,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned.");
      });
  });
};

module.exports.getEmployeesByManager = (manager) => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeManagerNum: manager,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned.");
      });
  });
};

module.exports.getEmployeeByNum = (num) => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeNum: num,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned.");
      });
  });
};

// module.exports.getManagers = () => {
//   return new Promise((resolve, reject) => {
//     Employee.findAll({
//       where: {
//         isManager: true,
//       },
//     })
//       .then(() => {
//         resolve(

//         );
//       })
//       .catch((err) => {
//         reject("no results returned.");
//       });
//   });
// };

module.exports.getDepartments = () => {
  return new Promise((resolve, reject) => {
    Department.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.addEmployee = (employeeData) => {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (var i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }

    Employee.create(employeeData)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("unable to create employee");
      });
  });
};

exports.updateEmployee = (employeeData) => {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;

    for (var i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }

    Employee.update(employeeData, {
      where: {
        employeeNum: employeeData.employeeNum,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("unable to create employee");
      });
  });
};

module.exports.addDepartment = (departmentData) => {
  return new Promise((resolve, reject) => {
    for (var i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }

    Department.create(departmentData)
      .then(resolve(Department.findAll()))
      .catch(reject("unable to add department"));
  });
};

module.exports.updateDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    for (let i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }
    Department.update(
      {
        departmentName: departmentData.departmentName,
      },
      {
        where: {
          departmentId: departmentData.departmentId,
        },
      }
    )
      .then(() => {
        resolve(Department);
      })
      .catch((err) => {
        reject("unable to update department");
      });
  }).catch(() => {
    reject("unable to update department");
  });
};

module.exports.getDepartmentById = (id) => {
  return new Promise((resolve, reject) => {
    Department.findAll({
      where: {
        departmentId: id,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("unable to find department");
      });
  });
};

module.exports.deleteDepartmentById = (id) => {
  return new Promise((resolve, reject) => {
    Department.destroy({
      where: {
        departmentId: id,
      },
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Department was not destroyed");
      });
  });
};

module.exports.deleteEmployeeByNum = (empNum) => {
  return new Promise((resolve, reject) => {
    Employee.destroy({
      where: {
        employeeNum: empNum,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject();
      });
  });
};
