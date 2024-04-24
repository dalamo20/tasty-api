const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const parser = require("body-parser");
const authRoutes = require("./routes/auth.routes");
const { error404, error500 } = require("./middleware/errors.middleware");
const userRoutes = require("./routes/user.routes");

const app = express();
const port = process.env.PORT || 3000;
const logLevel = process.env.LOG_LEVEL || "dev";
const env = process.env.NODE_ENV;

if (env != "test") {
  //middleware to log server reqs to console
  app.use(logger(logLevel));
}

//middleware - parses incoming reqs data (https://github.com/express.js/body-parser)
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
//allows websites to talk w/ api service
app.use(cors());

//handle routes for website (endpoints)
app.use("/api/auth", authRoutes); //http://localhost/3000/api/auth
app.use("/api/user", userRoutes); //http://localhost3000/api/user

//handle 404 reqs
app.use(error404);

//handle 500 reqs - applies to live services
app.use(error500);

//listen on server port
app.listen(port, () => {
  console.log(`Running on port: ${port} ...`);
});
