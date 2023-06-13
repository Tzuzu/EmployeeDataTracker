INSERT INTO department (dep_name)
VALUES ('Management'), 
       ('Sales'),
       ('IT'),
       ('Accounting');

INSERT INTO roles (title, salary, department_id)
VALUES ('Manager', 200000, 1),
       ('Assistant Manager', 150000, 1),
       ('Warehouse Lead', 135000, 1),
       ('Warehouse Assistant Lead', 115000, 1),
       ('Front End Leader', 100000, 1),
       ('Security Guard', 90000, 2),
       ('Merchandising Team', 70000, 2),
       ('Seasonal Merchandising', 50000, 2);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ('Yu', 'Narukami', 1, null),
       ('Yosuke', 'Hanamura', 2, null),
       ('Rise', 'Kujikawa', 3, null),
       ('Yukiko', 'Amagi', 4, null),
       ('Kanji', 'Tatsumi', 5, null),
       ('Tohru', 'Adachi', 6, 5), 
       ('Chie', 'Satonaka', 7, 3),
       ('Naoto', 'Shirogane', 8, 5); 