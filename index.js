const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { first } = require("rxjs");
const { title } = require("process");
require("console.table");

init();

function init() {
    const welcomeText = logo({ name: "Employee Manager" }).render();
    console.log(welcomeText);
    loadMainPrompts();
};

function loadMainPrompts () {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "Hello! What would you like to do?",
            choices: [
                {name: "View All Employees",
                value: "VIEW_EMPLOYEES"
                },
                {name: "View All Employees By Department",
                value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {name: "View All Employee By Manager",
                value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {name: "Add Employee",
                value: "ADD_EMPLOYEE"
                },
                {name: "Remove Employee",
                value: "REMOVE_EMPLOYEE"
                },
                {name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
                },
                {name: "Update Employee Manager",
                value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {name: "View All Roles",
                value: "VIEW_ROLES"
                },
                {name: "Add Role",
                value: "ADD_ROLE" 
                },
                {name: "Remove Role",
                value: "REMVOE_ROLE"
                },
                {name: "View All Departments",
                value: "VIEW_DEPARTMENTS"
                },
                {name: "Add Department",
                value: "ADD_DEPARTMENT"
                },
                {name: "Remove Department",
                value: "REMOVE_DEPARTMENT"
                },
                {name: "Quit, Please",
                value: "QUIT"
                }
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        switch (choice) {
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                viewEmployeesByDepartment();
                break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
                viewEmployeesByManager();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
                break;
            case "VIEW_ROLES":
                viewRoles();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "REMOVE_ROLE":
                removeRole();
                break;
            case "QUIT":
                quit();
                break;   
        }
    })
}

function viewEmployees() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => loadMainPrompts());
}

function viewEmployeesByDepartment() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Please select the department you would like to see employees for.",
                    choices: departmentChoices
                }
            ])
            .then(res => db.findAllEmployeesByDepartment(res.departmentId))
            .then(([rows]) => {
                let employees = rows;
                console.log("\n");
                console.table(employees);
            })
            .then(() => loadMainPrompts())
        });
}

function viewEmployeesByManager() {
    db.findAllEmployees()
        .then(([rows]) => {
            let managers = rows;
            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
        prompt([
            {
                type: "list",
                name: "managerId",
                message: "Please select the manager you want to see direct reports for.",
                choices: managerChoices
            }
        ])
            .then(res => db.findAllEmployeesByManager(res.managerId))
            .then(([rows])=> {
                let employees = rows;
                console.log("\n");
                if (employees.length === 0) {
                    console.log("The selected employee does not have direct reports at this time.");
                } else {
                    console.table(employees);
                }
            })
            .then(() => loadMainPrompts ())
        });
}

function removeEmployee () {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name}, ${last_name}`,
                value: id
            }))
        }),
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Please select the employee you would like to remove.",
                choices: employeeChoices
            }
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log("Employee removed from database."))
        .then(() => loadMainPrompts())
        ])
}

function updateEmployeeRole() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Please choose the employee to update role.",
                choices: employeeChoices
            }
        ])
        .then(res => {
            let employeeId = res.employeeId;
            db.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));
                prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message: "Please choose the role you want to assign to the selected employee.",
                        choices: roleChoices
                    }
                ])
                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console.log("Employee role updated"))
                .then(() => loadMainPrompts())
                });
        });
        })
}

function updateEmployeeManager() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name}) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Please select the employee to update their manager.",
                choices: employeeChoices
            }
        ])
        .then(res => {
            let employeeId = res.employeeId
            db.findAllPossibleManagers(employeeId)
                .then(([rows]) => {
                    let managers = rows;
                    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));
                prompt([
                    {
                        type: "list",
                        name: "managerId",
                        message: "Please select the manager to assign to the selected employee.",
                        choice: managerChoices
                    }
                ])
                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                .then(() => console.log("Employee manager updated."))
                .then (() => loadMainPrompts())
                })
        })
        });
}

function viewRoles() {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => loadMainPrompts());
}

function addRole() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
    prompt ([
        {
            name: "title",
            message: "Please enter the name of the role."
        },
        {
            name: "salary",
            message: "Please enter the salary of the role"
        },
        {
            type: "list",
            name: "department_id",
            message: "Please choose the department to assign this role.",
            choices: departmentChoices
        }
    ])
    .then(role => {
        db.createRole(role)
            .then(() => console.log(`${role.title} added to the database.`))
            .then(() => loadMainPrompts())
    })
    });
}

function removeRole() {
    db.findAllRoles()
    .then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }));
    prompt([
        {
            type: "list",
            name: "roleId",
            message: "Please select the role you wish to remove.",
            choices: roleChoices
        }
    ])
    .then(res => db.removeRole(res.roleId))
    .then(() => console.log("Role removed from database."))
    .then((() => loadMainPrompts))
    });
}

function viewDepartments() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
    })
    .then(() => loadMainPrompts());
}

function addDepartment() {
    prompt(
        {
            name: "name",
            message: "Please enter the name of the department to add."
        }
    )
    .then(res => {
        let name = res;
        db.createDepartment(name)
            .then (() => console.log(`Department ${name.name} added to the database.`))
            .then (() => loadMainPrompts())
    });
}

function removeDepartment() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));
        prompt({
            type: "list",
            name: "departmentId",
            message: "Please select the department you would like to remove.",
            choices: departmentChoices
        })
        .then(res => db.removeDepartment(res.departmentId))
        .then(() => console.log("Department removed from database."))
        .then(() => loadMainPrompts())
        });
}

function addEmployee() {
    prompt([
        {
            name: "first_name",
            message: "Please enter employee's first name."
        },
        {
            name: "last_name",
            message: "Please enter employee's last name."
        }
    ])
    .then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;

        db.findAllRoles()
            .then(([rows]) => {
                let roles = rows;
                const roleChoices = roles.map(({ id, titles }) => ({
                    name: title,
                    value: id
                }));
            prompt({
                type: "list",
                name: "roleId",
                message: "Please enter employee's role.",
                choices: roleChoices
            })
            .then(res => {
                let roleId = res.roleId;

                db.findAllEmployees()
                    .then(([rows]) => {
                        let employees = rows;
                        const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id
                        }));
                    prompt({
                        type: "list",
                        name: "managerId",
                        message: "Please select the employee's manager.",
                        choices: managerChoices
                    })
                    .then(res => {
                        let employee = {
                            manager_id: res.managerId,
                            role_id: roleId,
                            first_name: firstName,
                            last_name: lastName
                        }

                        db.createEmployee(employee);
                    })
                    .then(() => console.log(`New employee ${firstName} ${lastName} added to database.`))
                    .then(() => loadMainPrompts())
                    })
            })
            })
    });
}

function quit() {
    console.log("Goodbye!");
    process.exit();
  }
