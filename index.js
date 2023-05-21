const inquirer = require('inquirer')
const mysql = require('mysql2')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '501282',
        database: 'company_db'
    }
)
function init (){
inquirer.prompt(
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add an employee','add a role', 'update employee role'],
        name : 'choice'
    }   
).then(result=>{
    console.log(result.choice);
    const selectedChoice = result.choice
    switch(selectedChoice){
        case'view all departments':
            viewAllDepartments()
            break;
        case 'view all roles':
            viewAllRoles()
            break;
        case 'view all employees':
            viewAllEmployees()
            break;
        case 'add a department':
            addDepartment()
            break;
        case 'add an employee':
            addEmployee()
            break
        case 'add a role':
            addRole()
            break;
        case 'update employee role':
            updateRole()
            break;
    }
})

}
function viewAllDepartments (){
db.query('SELECT * from department',(err, result)=>{
    if (err){
        console.log(err);
    }else {
        console.table(result)
        init()
    }
})
}
function viewAllRoles (){

}
function viewAllEmployees(){

}

init()