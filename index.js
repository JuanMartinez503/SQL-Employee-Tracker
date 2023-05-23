const inquirer = require("inquirer");
const mysql = require("mysql2");
//I bring in the libraries needed for my application to work

const db = mysql.createConnection({
  //I use sequel to stablish a connection with my database
  host: "localhost",
  user: "root",
  password: "501282",
  database: "company_db",
});
//this function starts my whole application
function init() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add an employee",
        "Add a role",
        "Update employee role",
        "Exit",
      ],
      name: "choice",
    })
    .then((result) => {
      const selectedChoice = result.choice;
      //I perform a switch/case which does activates different functions to start
      switch (selectedChoice) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a role":
          addRole();
          break;
        case "Update employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          exitApp();
          break;
      }
    });
}

function viewAllDepartments() {
  //this shows me a table of all the ids, and department names of the departments table
  db.query("SELECT * FROM departments", (err, result) => {
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
    //this shows me a criteria of roles and shows the department name which the department table is connected by the department id.
    `SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id`,
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
    //this table connects two different tables
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, 
    roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id`,
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

function addDepartment() {
  //this function adds a department which automatically gets an id
  inquirer
    .prompt({
      type: "input",
      message: "What is the name of the new department?",
      name: "name",
    })
    .then((result) => {
      const { name } = result;
      db.query(
        "INSERT INTO departments (name) VALUES (?)",
        [name],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Department added successfully!");
            init();
          }
        }
      );
    });
}

function addRole() {
  //this function adds a role.
  db.query("SELECT * FROM departments", (err, departments) => {
    if (err) {
      console.log(err);
      init();
      return;
    }

    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
      //the departments is looped through with a map method. The department name is showed in the list choice, but the value which is the id is used.
    }));

    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter the title of the role:",
          name: "title",
        },
        {
          type: "input",
          message: "Enter the salary of the role:",
          name: "salary",
        },
        {
          type: "list",
          message: "Select the department for the role:",
          choices: departmentChoices,
          name: "departmentId",
        },
      ])
      .then((result) => {
        const { title, salary, departmentId } = result;
        db.query(
          "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
          [title, salary, departmentId],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Role added successfully!");
              init();
            }
          }
        );
      });
  });
}

function addEmployee() {
  //this adds an employee to the database.
  db.query("SELECT * FROM roles", (err, roles) => {
    if (err) {
      console.log(err);
      init();
      return;
    }
    //puts the roles into a list so I can choose it.
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    db.query("SELECT * FROM employees", (err, employees) => {
      if (err) {
        console.log(err);
        init();
        return;
      }

      const managerChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));

      managerChoices.unshift({ name: "None", value: null });

      inquirer
        .prompt([
          {
            type: "input",
            message: "Enter the first name of the employee:",
            name: "firstName",
          },
          {
            type: "input",
            message: "Enter the last name of the employee:",
            name: "lastName",
          },
          {
            type: "list",
            message: "Select the role for the employee:",
            choices: roleChoices,
            name: "roleId",
          },
          {
            type: "list",
            message: "Select the manager for the employee:",
            choices: managerChoices,
            name: "managerId",
          },
        ])
        .then((result) => {
          const { firstName, lastName, roleId, managerId } = result;
          db.query(
            "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
            [firstName, lastName, roleId, managerId],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Employee added successfully!");
                init();
              }
            }
          );
        });
    });
  });
}

function updateEmployeeRole() {
  //this updates the employees role
  db.query("SELECT * FROM employees", (err, employees) => {
    if (err) {
      console.log(err);
      init();
      return;
    }

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    db.query("SELECT * FROM roles", (err, roles) => {
      if (err) {
        console.log(err);
        init();
        return;
      }

      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Select the employee to update:",
            choices: employeeChoices,
            name: "employeeId",
          },
          {
            type: "list",
            message: "Select the new role for the employee:",
            choices: roleChoices,
            name: "roleId",
          },
        ])
        .then((result) => {
          const { employeeId, roleId } = result;
          db.query(
            "UPDATE employees SET role_id = ? WHERE id = ?",
            [roleId, employeeId],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Employee role updated successfully!");
                init();
              }
            }
          );
        });
    });
  });
}

function exitApp() {
  console.log("Exiting application...");
  process.exit();
}
//closes the application when you click on the exit choice

init();
//this starts the whole application
