# Business Database Website

### Languages and Tools Used:

<img height="32" width="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png" /> <img height="32" width="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/bootstrap/bootstrap.png" />
<img height="32" width="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" />
<img height="32" width="32" src="https://avatars.githubusercontent.com/u/5658226?s=200&v=4" />
<img height="32" width="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png" />
<img height="32" width="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png" />
<img height="32" width="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/postgresql/postgresql.png" />
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mongodb.svg" />
<img height="32" width="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png" />
<img height="32" width="52" src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg" />

### About

This assignment was to create a full-stack website using frameworks like ExpressJS, SequelizeJS, and PostgreSQL for queries, BcryptJS for authentication and password hashing encryption, and Mongoose/MongoDB Atlas for database management. 

### You can register for an account or use the test account below:

Username: test Password: 123

The Live Demo Web App Link: https://aqueous-peak-42879.herokuapp.com/

### Employee queries that are available:

<pre>/employee/:num</pre> 
Returns an employee by their employee number. For example /employee/2 will return employee number 2. Also allows editing.

<pre>/employees?department</pre> 
Returns all of the employees sorted by department. /employees?department=1 returns a list of employees that are in department 1.

<pre>/employees?status</pre> 
Returns all of the employees sorted by status, either "Full Time" or "Part Time". /employees?status=Full Time returns a list of employees that have "Full Time" status

<pre>/employees?manager</pre> 
Returns all of the employees sorted by their manager number. For example /employees?manager=1 returns a list of employees of manager's whose employee number is 1.

### Department queries that are available:

<pre>/department/:departmentId</pre> 
Returns a department by the department id. For example /department/2 will return department number 2. 
