INSERT INTO departments ( name)
VALUES
( 'Engineering'),
( 'Marketing'),
( 'Finance'),
('Human Resources'),
( 'Sales');

INSERT INTO roles (title, salary, department_id )
VALUES
( 'Lead Engineer', 180000,1),
('Head sales person', 150000,5),
( 'Manager', 90000,2),
( 'UX designer', 120000,1),
( 'Accountant', 100000,3);

INSERT INTO employees ( first_name, last_name, role_id, manager_id)
VALUES
('Juan', 'Martinez', 1, NULL),
('Sarah', 'Mehringer', 3, 1),
('Pip', 'London', 2, 1),
( 'Cincy', 'Wilma', 4, 3),
( 'David', 'Brown', 5, 2);
