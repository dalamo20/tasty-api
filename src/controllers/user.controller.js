const bcrypt = require("bcryptjs");
const mysql = require("mysql");

const connection = require("../db-config");
const query = require("../utils/query");
const {
  GET_USER_BY_ID,
  GET_USER_BY_ID_WITH_PASSWORD,
  UPDATE_USER,
  DELETE_USER,
} = require("../queries/user.queries");
const { serverError } = require("../utils/handlers");

exports.getUser = async (req, res) => {
  // verify valid token
  const decoded = req.user; // {id: 1, iat: wlenfwekl, expiredIn: 9174323 }

  // take result of middleware check
  if (decoded.id) {
    // establish a connection
    const con = await connection().catch((err) => {
      throw err;
    });

    const user = await query(con, GET_USER_BY_ID(decoded.id)).catch(
      serverError(res)
    );

    if (!user.length) {
      res.status(400).send({ msg: "No user found." });
    }
    res.json(user);
  }
};

const _buildValuesString = (body) => {
  // const body = req.body;
  const values = Object.keys(body).map(
    // [name, status].map()
    (key) => `${key} = ${mysql.escape(body[key])}` // 'New 1 drink name'
  );

  // values.push(`created_date = NOW()`); // update current date and time
  values.join(", "); // make into a string
  return values;
};

exports.updateUser = async function (req, res) {
  // establish a connection
  const con = await connection().catch((err) => {
    throw err;
  });

  const eUserName = mysql.escape(req.user.id);

  // Check for existing user first
  const user = await query(
    con,
    GET_USER_BY_ID_WITH_PASSWORD(req.user.id)
  ).catch(serverError(res));

  const passwordUnchanged = await bcrypt
    .compare(req.body.password, user[0].password)
    .catch((err) => {
      res.json(500).json({ msg: "Invalid password!" });
    });

  //checks password change. Use same steps for email lines 74-96
  if (!passwordUnchanged) {
    const passwordHash = bcrypt.hashSync(req.body.password);

    //encapsulating object in build function
    const updatedValueHash = _buildValuesString({
      ...req.body,
      password: passwordHash,
    });

    // Perform update
    const result = await query(
      con,
      UPDATE_USER(updatedValueHash, user[0].id)
    ).catch(serverError(res));

    if (result.affectedRows === 1) {
      return res.json({ msg: "Updated succesfully!" });
    }
    res.json({ msg: "Nothing to update..." });
  }
};

exports.deleteUser = async function (req, res) {
  const userId = req.params.userId;

  //is this a valid user?
  if (!userId) {
    return res.status(400).json({ msg: "User not found." });
  }

  const con = await connection().catch((err) => {
    throw err;
  });

  const result = await query(con, DELETE_USER(userId)).catch(serverError(res));

  if (result.affectedRows !== 1) {
    return res.status(404).json({ msg: "User not found." });
  }
  res.json({ msg: "User deleted successfully." });
};
