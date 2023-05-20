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
})

}
init()