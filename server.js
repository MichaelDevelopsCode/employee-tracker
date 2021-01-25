const mysql = require('mysql2');
const inquirer = require('inquirer');
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
    startApp();
});

function showMenu() {
    return inquirer.prompt([
        {
            type: "list",
            name: "mainMenu",
            message: 'What would you like to do? ',
            choices: [
                { name: "View all departments", value: "viewDepartments" },
                { name: "View all roles", value: "viewRoles" },
                { name: "View all employees", value: "viewEmployees" },
                { name: "Add a department", value: "addDepartment" },
                { name: "Add a role", value: "addRole" },
                { name: "Add an employee", value: "addEmployee" },
                { name: "Update an employee role", value: "updateRole" }
            ]
        }
    ]);
};

function viewDepartments() {
    connection.query('SELECT department.id, department.name AS department FROM department',
        function(err, res) {
            if (err) throw err;
            console.table(res);
            // go back to menu
            startApp();
        }
    );
};

function viewRoles() {
    const sql = `SELECT role.id, role.title, role.salary, department.name AS department
        FROM role 
        LEFT JOIN department 
        ON role.department_id = department.id`;
    connection.query(sql, 
        function(err, res) {
            if (err) throw err;
            console.table(res);
            // go back to menu
            startApp();
        }
    );
};

function viewEmployees() {
    const sql = `SELECT employee1.id, employee1.first_name, employee1.last_name, role.title, department.name AS department, role.salary, CONCAT(employee2.first_name, " ", employee2.last_name) AS manager
        FROM employee AS employee1
        LEFT JOIN role ON employee1.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS employee2 ON employee1.manager_id = employee2.id`;

    connection.query(sql, 
        function(err, res) {
            if (err) throw err;
            console.table(res);
            // go back to menu
            startApp();
        }
    );
};

function addDepartment() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Enter department name:",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    return "Please enter department name";
                }
            }
        }
    ]).then(response => {
            connection.query('INSERT INTO department (name) VALUES (?)', [response.name],
                function(err, res) {
                    if (err) throw err;
                    console.log('Added department to ID: ' + res.insertId);
                    // go back to menu
                    startApp();
                }
            )
        }
    );
};
  

function addRole() {
    let departmentList = {};
    connection.query('SELECT * FROM department', 
        function(err, res) {
            if (err) throw err;
            // get list of departments so user can choose from them
            for (var i = 0; i < res.length; i++) {
                departmentList.push({
                    name: res[i].name,
                    value: res[i].id
                });
            };
        }
    );
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "Enter title of role: ",
            validate: titleInput => {
                if (titleInput) {
                    return true;
                } else {
                    return "Please enter title of role";
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: "Enter role salary: ",
            validate: salaryInput => {
                if (salaryInput) {
                    return true;
                } else {
                    return "Please enter role salary";
                }
            }
        },
        {
            type: 'list',
            name: 'department',
            message: "Select department the role is in: ",
            choices: departmentList
        }
    ]).then(response => {
            const sql = `
            department.name AS department
            FROM role 
            LEFT JOIN department 
            ON role.department_id = department.id

            INSERT INTO role (title, salary, department_id ) VALUES (?, ?, ?)`
            connection.query(`INSERT INTO role (title, salary, department ) VALUES (?, ?, ?)`, [response.title, response.salary, response.department],
                function(err, res) {
                    if (err) throw err;
                    console.log('Added ' + res.title + ' to department ' + res.department);
                    // go back to menu
                    startApp();
                }
            )
        }
    );
}



const startApp = async () => {
    await showMenu()
        .then(response => {
            if (response.mainMenu === "viewDepartments") {
                return viewDepartments();
            }
            if (response.mainMenu === "viewRoles") {
                return viewRoles();
            }
            if (response.mainMenu === "viewEmployees") {
                return viewEmployees();
            }
            if (response.mainMenu === "addDepartment") {
                return addDepartment();
            }
            if (response.mainMenu === "addRole") {
                return addRole();
            }
            if (response.mainMenu === "addEmployee") {

            }
            if (response.mainMenu === "updateRole") {

            }
        });
}