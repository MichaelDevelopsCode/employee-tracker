INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Art"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", "100000", 1 ), ("Sales Person", "80000", 1), ("Lead Engineer", "150000", 2), ("Software Engineer", "120000", 2), ("Accountant", "120000", 4), ("Legal Team Lead", "260000", 5), ("Lawyer", "200000", 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Micah", "Johnson", 1, null), ("Jone", "James", 1, 1);

