use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 99000, 1),
    ('Salesperson', 75000, 1),
    ('Lead Engineer', 125000, 2),
    ('Software Engineer', 100000, 2),
    ('Account Manager', 112000, 3),
    ('Accountant', 90000, 3),
    ('Legal Team Lead', 225000, 4),
    ('Lawyer', 109000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Janet', 'Smith', 2, 1),
    ('Alice', 'Wonderland', 3, NULL),
    ('Cesar', 'Iglesias', 4, 3),
    ('Mariah', 'Carey', 5, NULL),
    ('Romeo', 'Jules', 6, 5),
    ('Cat', 'Talking', 7, NULL),
    ('Boy', 'George', 8, 7);
