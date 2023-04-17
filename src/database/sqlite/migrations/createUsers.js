const createUsers = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    name VARCHAR,
    email VARCHAR,
    phone INT,
    birthday TIMESTAMP,
    hometown VARCHAR,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

module.exports = createUsers;