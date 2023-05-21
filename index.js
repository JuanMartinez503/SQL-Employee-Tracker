const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "501282",
  database: "company_db",
});
function init() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add an employee",
        "add a role",
        "update employee role",
      ],
      name: "choice",
    })
    .then((result) => {
      console.log(result.choice);
      const selectedChoice = result.choice;
      switch (selectedChoice) {
        case "view all departments":
          viewAllDepartments();
          break;
        case "view all roles":
          viewAllRoles();
          break;
        case "view all employees":
          viewAllEmployees();
          break;
        case "add a department":
          addDepartment();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "add a role":
          addRole();
          break;
        case "update employee role":
          updateRole();
          break;
      }
    });
}
function viewAllDepartments() {
  db.query("SELECT * from departments", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
      init();
    }
  });
}
function viewAllRoles() {
    db.query(
      `SELECT roles.title, roles.id AS role_id, departments.name AS department, roles.salary
      FROM roles
      JOIN departments ON roles.department_id = departments.id`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.table(result);
          init();
        }
      }
    );
  }
  function viewAllEmployees() {
    db.query(
      `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager
      FROM employees
      INNER JOIN roles ON employees.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees AS managers ON employees.manager_id = managers.id`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.table(result);
          init();
        }
      }
    );
  }
  
  
  
function addDepartment() {}
function addEmployee() {}
function addRole() {}
function updateRole() {}
init();
