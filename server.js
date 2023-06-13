const inquirer = require('inquirer');
const mySql = require('mysql2')
const conTab = require('console.table')
require('dotenv').config();

const connection = mySql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'employee_tracker_db'
    },
    console.log('Connected to Application!')
);

const questions = [{
    type: "list",
    name: "option",
    message: "What do you wish to do?",
    choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Exit Menu'
    ]
}];

function runEmployeeTracker() {
    inquirer.prompt(questions)
    .then((answer) => {
        if (answer.option === 'View All Employees') {
            viewEmployees();
        } else if (answer.option === 'Add Employee') {
            addEmployee();
        } else if (answer.option === 'Update Employee Role') {
            updateEmployeeRole();
        } else if (answer.option === 'View All Roles') {
            viewRoles();
        } else if (answer.option === 'Add Role') {
            addRole();
        } else if (answer.option === 'View All Departments') {
            viewDepartments();
        } else if (answer.option === 'Add Department') {
            addDepartment();
        } else if (answer.option === 'Exit Menu') {
            process.exit();
        }
    });
};

function viewEmployees() {
    console.log('Displaying all active employees');
    const sql = `SELECT * FROM employee`
    connection.query(sql, (err, result) => {
        console.table(result);
        runEmployeeTracker();
    });
};

function viewRoles() {
    console.log('Displaying all roles');
    const sql = `SELECT * from roles`
    connection.query(sql, (err, result) => {
        console.table(result);
        runEmployeeTracker();
    })
}

function viewDepartments() {
    console.log('Displaying all departments');
    const sql = `SELECT * from department`
    connection.query(sql, (err, result) => {
        console.table(result);
        runEmployeeTracker();
    })
}

function addEmployee() {
    connection.query("SELECT id, title FROM roles", function(err, res) {
        roleTitles = res.map(r => ({ "name": r.title, "value": r.id}));
        connection.query("SELECT id, first_name, last_name FROM employee", function(err, res) {
            managers = res.map(r => ({ "name": r.first_name + " " + r.last_name, "value": r.id }));
            managers.push({name: "None", value: null})
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'employeeFirst',
                    message: 'What is the employees first name?'
                },{
                    type: 'input',
                    name: 'employeeLast',
                    message: 'What is the employees last name?'
                },{
                    type: 'list',
                    name: 'employeeRole',
                    message: 'What is the employees role?',
                    choices: roleTitles
                },{
                    type: 'list',
                    name: 'employeeManager',
                    message: 'Who is their manager (If applicable)',
                    choices: managers
                }
            ])
            .then((answers) => {
                let sql = "INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)";
                connection.query(sql, [answers.employeeFirst, answers. employeeLast, answers.employeeRole, answers.employeeManager], function(err, res) {
                    viewEmployees();
                    console.log('Successfully added the employee!');
                });
            });
        });
    });
}

function addRole() {
    connection.query("SELECT id, dep_name FROM department", function(err, res) {
        departmentNames = res.map(r => ({"name": r.dep_name, "value": r.id}));    
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the role?'
            },{
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary of the role?'
            },{
                type: 'list',
                name: 'roleDepartment',
                message: 'What department is this role a part of?',
                choices: departmentNames
            }
        ])
        .then((answers) => {
            let sql = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
            connection.query(sql, [answers.roleName, answers.roleSalary, answers.roleDepartment], function(err, res) {
                viewEmployees();
                console.log('Successfully added the new role!');
            });
        });
    });
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'deptName',
        message: 'What is the name of the new department?'
    })
    .then((answers) => {
        let sql = "INSERT INTO department (dep_name) VALUES (?)";
        connection.query(sql, [answers.deptName], function(err, res) {
            viewEmployees();
            console.log('Successfully added new department!');
        });
    });
}

function updateEmployeeRole() {
    connection.query("SELECT id, title FROM roles", function(err, res) {
        roleNames = res.map(r => ({ "name": r.title, "value": r.id}))
        inquirer.prompt([{
            type: 'input',
            name: 'employeeID',
            message: 'Please enter the ID of the employee you wish to update'
        },{
            type: 'list',
            name: 'employeeRole',
            message: 'Please select their new role',
            choices: roleNames
        }])
        .then((answers) => {
            let sql = "UPDATE employee SET roles_id = ? WHERE id = ?";
            connection.query(sql, [answers.employeeRole, answers.employeeID], function(err, res) {
                viewEmployees();
                console.log('Successfully updated employee role!');
            });
        });
    })
}

runEmployeeTracker();