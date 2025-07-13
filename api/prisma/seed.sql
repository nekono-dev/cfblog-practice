-- Create roles
INSERT INTO Role (id, name, writeAble, loginAble, listAble)
VALUES 
  (0, 'anonymous', 0, 0, 0),
  (1, 'admin', 1, 1, 1),
  (2, 'ci', 0, 0, 1),
  (3, 'user', 0, 1, 0);
-- Create anonymous user (password: anonypwd)
INSERT OR IGNORE INTO User (id, handle, name, birthday, hashedPassword, roleId)
VALUES (
  0,
  'anony',
  'Anonymous User',
  '1900-01-01T00:00:00.000Z',
  '$2a$10$GBIflAh1jz7ZHMKvuvIu6u9I2RdHRR9UxeQR5rtgrt513yDq0y/Bm',
  0
);
-- Create admin user (password: adminpwd)
INSERT INTO User (id, handle, name, birthday, hashedPassword, roleId)
SELECT 
  1,
  'admin',
  'Administrator',
  '1900-01-01T00:00:00.000Z',
  '$2a$10$GAhxLK4B9ubZc2cgpD9zjO7qapsnN0BuNf8POTmTNz88OnHUU/Apq',
  1
WHERE NOT EXISTS (
  SELECT 1 FROM User WHERE handle = 'admin'
);
-- Create regular test user (password: userpwd)
INSERT OR IGNORE INTO User (id, handle, name, birthday, hashedPassword, roleId)
VALUES (
  2,
  'ciuser',
  'CI User',
  '1900-01-01T00:00:00.000Z',
  '$2a$10$Cg8gLSkDnsW9UUR8x8pvEujQagfwFDu24gwNY.wwP6k5zl2iZGd5y',
  2
);