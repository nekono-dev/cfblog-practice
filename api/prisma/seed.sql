DELETE FROM User;
INSERT INTO User (handle, name, hashedPassword, writeAble)
-- initial password: admin
SELECT 'admin', 'Administrator', '$2b$10$xnWlP0sDsboQ77ru/ib2kuk0qOADVFzLdJAIm4sjtlc7WG5cmW4Ne', 1
WHERE NOT EXISTS (
  SELECT 1 FROM User WHERE writeAble = 1
);

