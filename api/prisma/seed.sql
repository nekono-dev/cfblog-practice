INSERT INTO User (handle, name, birthday, hashedPassword, writeAble)
-- initial password: admin
SELECT 'admin', 'Administrator', '1900-01-01T00:00:00.000Z', '$2b$10$xnWlP0sDsboQ77ru/ib2kuk0qOADVFzLdJAIm4sjtlc7WG5cmW4Ne', 1
WHERE NOT EXISTS (
  SELECT 1 FROM User WHERE writeAble = 1
);
