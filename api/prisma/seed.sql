-- create admin, password: adminpwd
INSERT INTO User (id, handle, name, birthday, hashedPassword, writeAble, loginAble)
SELECT 1, 'admin', 'Administrator', '1900-01-01T00:00:00.000Z', '$2a$10$GAhxLK4B9ubZc2cgpD9zjO7qapsnN0BuNf8POTmTNz88OnHUU/Apq', 1 , 1
WHERE NOT EXISTS (SELECT 1 FROM User WHERE writeAble = 1);
-- anonymous user: no login, id 0, for test, passwd: anonypwd
INSERT OR IGNORE INTO User (id, handle, name, birthday, hashedPassword, writeAble, loginAble)
VALUES (
  0, 'anony', 'Anonymous User', '1900-01-01T00:00:00.000Z', '$2a$10$GBIflAh1jz7ZHMKvuvIu6u9I2RdHRR9UxeQR5rtgrt513yDq0y/Bm', 0, 0
);
