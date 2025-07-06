-- create admin, password: admin
INSERT INTO User (id, handle, name, birthday, hashedPassword, writeAble, loginAble)
SELECT 1, 'admin', 'Administrator', '1900-01-01T00:00:00.000Z', '$2b$10$xnWlP0sDsboQ77ru/ib2kuk0qOADVFzLdJAIm4sjtlc7WG5cmW4Ne', 1, 1
WHERE NOT EXISTS (
  SELECT 1 FROM User WHERE writeAble = 1
);
-- anonymous user: no login, id 0
INSERT OR IGNORE INTO User (id, handle, name, birthday, hashedPassword, writeAble, loginAble)
VALUES (
  0, 'anony', 'Anonymous User', '1900-01-01T00:00:00.000Z', '', 0, 0
);
