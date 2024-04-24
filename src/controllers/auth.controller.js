const bcrypt = require("bcryptjs");
const mysql = require("mysql");

const connection = require("../db-config");
const {
  GET_USER_BY_USERNAME,
  GET_USER_BY_USERNAME_WITH_PASSWORD,
  INSERT_NEW_USER,
} = require("../queries/user.queries");
const query = require("../utils/query");
const {
  refreshTokens,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt-helpers");
const { serverError } = require("../utils/handlers");

exports.register = async (req, res) => {
  // params setup
  const passwordHash = bcrypt.hashSync(req.body.password);
  const params = [req.body.username, req.body.email, passwordHash];

  // establish a connection
  const con = await connection().catch((err) => {
    throw err;
  });

  const eUserName = mysql.escape(req.body.username);
  const eEmail = mysql.escape(req.body.email);
  const ePass = mysql.escape(passwordHash);

  //checks for existing user
  const user = await query(con, GET_USER_BY_USERNAME(eUserName)).catch(
    serverError(res)
  );

  if (user.length === 1) {
    res.status(403).send({ msg: "User already exists!" });
  } else {
    //adds new user
    const result = await query(
      con,
      INSERT_NEW_USER(eUserName, eEmail, ePass)
    ).catch(serverError(res));

    res.send({ msg: "New user created!" });
  }
};

exports.login = async (req, res) => {
  // establish a connection
  const con = await connection().catch((err) => {
    throw err;
  });

  const eUserName = mysql.escape(req.body.username);

  // check for existing user first
  const user = await query(
    con,
    GET_USER_BY_USERNAME_WITH_PASSWORD(eUserName)
  ).catch(serverError(res));

  // if the user exists
  if (user.length === 1) {
    //   validate entered password from database saved password
    const validPass = await bcrypt
      .compare(req.body.password, user[0].password)
      .catch((err) => {
        res.json(500).json({ msg: "Invalid password!" });
      });

    if (!validPass) {
      res.status(400).send({ msg: "Invalid password!" });
    }
    // create token
    const accessToken = generateAccessToken(user[0].id, {
      // {id: 1, iat: wlenfwekl, expiredIn: 9174323 }
      expiresIn: 86400,
    });
    const refreshToken = generateRefreshToken(user[0].id, {
      expiresIn: 86400,
    });

    refreshTokens.push(refreshToken);

    res
      .header("access_token", accessToken) // ex.: { 'aut-token': 'lksnenha0en4tnoaeiwnlgn3o4i'}
      .send({
        auth: true,
        msg: "Logged in!",
        token_type: "bearer",
        access_token: accessToken,
        expires_in: 86400,
        refresh_token: refreshToken,
      });
  }
};

exports.token = (req, res) => {
  const refreshToken = req.body.token;

  // stop user auth validation if no token provided
  if (!refreshToken) {
    res
      .status(401)
      .send({ auth: false, msg: "Access Denied. No token provided." });
  }

  // stop refresh is refresh token invalid
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).send({ msg: "Invalid Refresh Token" });
  }

  const verified = verifyToken(refreshToken, jwtconfig.refresh, req, res);

  if (verified) {
    const accessToken = generateToken(user[0].id, { expiresIn: 86400 });
    res
      .header("access_token", accessToken) // ex.: { 'aut-token': 'lksnenha0en4tnoaeiwnlgn3o4i'}
      .send({
        auth: true,
        msg: "Logged in!",
        token_type: "bearer",
        access_token: accessToken,
        expires_in: 20,
        refresh_token: refreshToken,
      });
  }
  res.status(403).send({ msg: "Invalid Token" });
};

exports.logout = (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);
  res.send({ msg: "Logout successful" });
};
