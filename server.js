const mysql = require('mysql2');
const inquirer = require('inquirer');
const menu = require('inquirer-menu');
const cTable = require('console.table');



// Creates the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: 'password',
    database: 'employeeDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    menu(startMenu);
});
  
function startMenu() {
    return {
        type: "list",
        name: "startMenu",
        message: 'What would you like to do?',
        choices: {
            "View all departments": viewDepartments,
            // "View all roles": viewRoles,
            // "View all employees": viewEmployees,
            // "Add a department": addDepartment,
            // "Add a role": addRole,
            // "Add an employee": addEmployee,
            // "Update an employee role": updateRole
        }
    };
};

function viewDepartments() {
    connection.query('SELECT * FROM department',
        function(err, res) {
            if (err) throw err;
            console.table(res);
        }
    );
}
  