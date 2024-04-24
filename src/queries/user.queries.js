exports.CREATE_USERS_TABLE = `CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL UNIQUE,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (id)
)`;

exports.GET_USER_BY_ID = (decodedId) =>
  `SELECT id, username, email FROM users WHERE id = ${decodedId}`;

exports.GET_USER_BY_USERNAME = (userName) =>
  `SELECT id, username, email FROM users WHERE username = ${userName}`;

exports.GET_USER_BY_ID_WITH_PASSWORD = (userId) =>
  `SELECT * FROM users WHERE id = ${userId}`;

exports.GET_USER_BY_USERNAME_WITH_PASSWORD = (userName) =>
  `SELECT * FROM users WHERE username = ${userName}`;

exports.INSERT_NEW_USER = (userName, email, pass) =>
  `INSERT INTO users (username, email, password) VALUES (${userName}, ${email}, ${pass})`;

exports.UPDATE_USER = (newValues, userId) =>
  `UPDATE users SET ${newValues} WHERE id = ${userId}`;

exports.DELETE_USER = (userId) => `DELETE FROM users WHERE id = ${userId}`;

//admin functionality => future
exports.VIEW_ALL_USERS = `SELECT id, username, email FROM users`;
