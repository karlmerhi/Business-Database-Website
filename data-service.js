/*************************************************************************************************************** */
/*************************************************************************************************************** */
// Setting the POSTGRES DATABASE
var Sequelize=require("sequelize");
/***************************************************************************************************************/
// setting up the database connection
var sequelize=new Sequelize('d6hjiepk2v3j68','qmhiavdtwbgzmo','e615bdc9dfc5f38ad5bff599f8dc771480bcae00da702c49a8d8bb899f20caaa',{

  host:'ec2-54-225-115-234.compute-1.amazonaws.com',
  dialect:'postgres',
  port:5432,
  dialectOptions:{
    ssl:true
  }

});

/************************************************************************************************************/
/********************************************************* */
// creating an EMPLOYEE model

var Employee=sequelize.define('Employee',{
  employeeNum:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  firstName:Sequelize.STRING,
  lastName:Sequelize.STRING,
  email:Sequelize.STRING,
  SSN:Sequelize.STRING,
  addressStreet:Sequelize.STRING,
  addressCity:Sequelize.STRING,
  addressState:Sequelize.STRING,
  addressPostal:Sequelize.STRING,
  maritalStatus:Sequelize.STRING,
  isManager:Sequelize.BOOLEAN,
  employeeManagerNum:Sequelize.INTEGER,
  status:Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate:Sequelize.STRING
  
},{
  createdAt:false,
  updatedAt:false
});


/********************************************************* */
/********************************************************* */
//creating the DEPARTMENT model
var Department=sequelize.define('Department',{
  departmentId:
  {
   type:Sequelize.INTEGER,
   primaryKey:true,
   autoIncrement:true
  },
  departmentName:Sequelize.STRING
},
{
   createdAt:false,
   updatedAt:false
});

// hasMany Relationship
Department.hasMany(Employee,{foreignKey:'department'});
/********************************************************* */
/********************************************************* */
/* Introducing the initialize() function*/
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) { /*initializing promise*/
    
    sequelize.sync().then(()=>{     
      resolve();
    }).catch((error)=>{
      reject("unable to sync the database");
    });
   
  });
}


/******************************************************************* */
/*************************************************************************************************************** */
/*************************************************************************************************************** */
/* Declaration of getAllEmployees function */

module.exports.getAllEmployees=function()
{
  
  return new Promise(function (resolve,reject){
  
    Employee.findAll().then((data)=>{
      resolve(data);

    }).catch((error)=>{
      reject( "no results returned");
    });
});

}
/******************************************************************* */

/*************************************************************************************************************** */
/*************************************************************************************************************** */
/* Declaration of getDepartments function */
 module.exports.getDepartments=function()
 {
   return new Promise((resolve,reject)=>{
    Department.findAll().then((data)=>{
      resolve(data);
    }).catch((error)=>{
      reject("no results returned");
    })
  });
 }

/******************************************************************* */
/*************************************************************************************************************** */
/*************************************************************************************************************** */
/* Add_Employees Module */

module.exports.addEmployee=function(employeeData)
{
  
  return new Promise(function(resolve,reject){
    //setting some parameters of employeeData 
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for(const prop in employeeData)
    {
      if(employeeData[prop]=="")
      {
        employeeData[prop]=null;
      }
    }

    //creating new employee
    
    Employee.create({
      firstName:employeeData.firstName,
      lastName:employeeData.lastName,
      email:employeeData.email,
      SSN:employeeData.SSN,
      addressStreet:employeeData.addressStreet,
      addressCity:employeeData.addressCity,
      addressState:employeeData.addressState,
      addressPostal:employeeData.addressPostal,
      maritalStatus:employeeData.maritalStatus,
      isManager:employeeData.isManager,
      employeeManagerNum:employeeData.employeeManagerNum,
      status:employeeData.status,
      department: employeeData.department,
      hireDate:employeeData.hireDate

    }).then(()=>{
      resolve("Employee created successfully");
    }).catch((error)=>{
      reject("unable to create employee");
    });


    
});

}

/******************************************************************* */
/*************************************************************************************************************** */
/*************************************************************************************************************** */
// getEmployeesByStatus(status) function //

module.exports.getEmployeesByStatus=function(status1)
{

  return new Promise(function(resolve,reject){
  
    Employee.findAll({
      
         where:{status:status1}  

    }).then((data)=>{
      resolve(data);
    }).catch((error)=>{
      reject("no results returned");
    });
  
});

}




/******************************************************************* */
/*************************************************************************************************************** */
/*************************************************************************************************************** */
// module getEmployeesByDepartment(department)

module.exports.getEmployeesByDepartment=function(departmentNo)
{
  return new Promise(function(resolve,reject){
    Employee.findAll({
     
      where:{
        department:departmentNo
      }
    }).then((data)=>{
      resolve(data);
    }).catch((error)=>{
      resolve( "no results returned");
    });
    
  });
}

/******************************************************************* */
/*************************************************************************************************************** */
/*************************************************************************************************************** */

// getEmployeesByManager(manager) Function 
module.exports.getEmployeesByManager=function(manager){

  return new Promise((resolve,reject)=>{
  Employee.findAll({
   
    where:{
      employeeManagerNum:manager
    }
  }).then((data)=>{
    resolve(data);
  }).catch((error)=>{
    reject("no results returned");
  });
});



}


/******************************************************************* */

/*************************************************************************************************************** */
/*************************************************************************************************************** */
// getEmployeeByNum function 

module.exports.getEmployeeByNum=function(num)
{
  return new Promise((resolve,reject)=>{
      Employee.findAll({
        
        where:{
          employeeNum:num
        }
      }).then((data)=>{
        resolve(data[0]);
      }).catch((error)=>{
        reject("no results returned");
      });  
});

}

/***************************/
// updateEmployee function 
/**************************/
/*************************************************************************************************************** */
/*************************************************************************************************************** */
module.exports.updateEmployee=function(newData)
{
  
  
  return new Promise((resolve,reject)=>{
    //setting some parameters of employeeData 
    newData.isManager = (newData.isManager) ? true : false;
    for(const prop in newData)
    {
      if(newData[prop]=="")
      {
        newData[prop]=null;
      }
    }

    Employee.update({
      firstName:newData.firstName,
      lastName:newData.lastName,
      email:newData.email,
      SSN:newData.SSN,
      addressStreet:newData.addressStreet,
      addressCity:newData.addressCity,
      addressState:newData.addressState,
      addressPostal:newData.addressPostal,
      maritalStatus:newData.maritalStatus,
      isManager:newData.isManager,
      employeeManagerNum:newData.employeeManagerNum,
      status:newData.status,
      department: newData.department,
      hireDate:newData.hireDate
    },{
      where:{employeeNum:newData.employeeNum}
      
    }).then(()=>{
      resolve();
    }).catch((error)=>{
      reject("unable to update employee");
    })
});

}
/*************************************************************************************************************** */
/*************************************************************************************************************** */
//Deleting the employee by the employee number
module.exports.deleteEmployeeByNum=function(empNum)
{
  return new Promise((resolve,reject)=>{

    
    Employee.destroy({
      where:{employeeNum:empNum}
    }).then(()=>{
      resolve();
    }).catch((error)=>{
      console.log(error);
      reject("unable to delete employee");
    });
    });
    
}
// ALL FUNCTIONS RELATED TO DEPARTMENT PAGE 
/*************************************************************************************************************** */
/*************************************************************************************************************** */
// Adding the addDepartment function

module.exports.addDepartment=function(departmentData)
{
  return new Promise(function(resolve,reject){
    //setting some parameters of departmentData 
   
    for(const prop in departmentData)
    {
      if(departmentData[prop]=="")
      {
        departmentData[prop]=null;
      }
    }

    //creating new DEPARTMENT

    Department.create({
      departmentName:departmentData.departmentName
    }).then(()=>{
      resolve();
    }).catch((error)=>{
      reject("unable to create department");
    });
    
  });

}
/*************************************************************************************************************** */
/*************************************************************************************************************** */
// defining the updateDepartment function

module.exports.updateDepartment=function(departmentData)
{
  return new Promise((resolve,reject)=>{
  for(const prop in departmentData)
  {
    if(departmentData[prop]=="")
    {
      departmentData[prop]=null;
    }
  }

   Department.update({
     departmentName:departmentData.departmentName
   },{
     where:{departmentId:departmentData.departmentId}
   }).then(()=>{
     resolve();
   }).catch((error)=>{
     reject("unable to update department");
   });


});

}
/*************************************************************************************************************** */
/*************************************************************************************************************** */
// defining the getDepartmentById function

module.exports.getDepartmentById=function(id)
{
  return new Promise((resolve,reject)=>{
  Department.findAll({
  
    where:{departmentId:id}
  }).then((data)=>{
    resolve(data[0]);
  }).catch((error)=>{
    reject("no results returned");
  });
});
}

/*************************************************************************************************************** */
/*************************************************************************************************************** */
// defining the deleteDepartmentById function
module.exports.deleteDepartmentById=function(id)
{
  return new Promise((resolve,reject)=>{

    
  Department.destroy({
    where:{departmentId:id}
  }).then(()=>{
    resolve();
  }).catch((error)=>{
    console.log(error);
    reject("unable to delete department");
  });
  });
  
}
/*************************************************************************************************************** */
/*************************************************************************************************************** */

