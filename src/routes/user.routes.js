const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const canAccess = require("../middleware/auth.middleware");
const userRoutes = express.Router();

userRoutes.get("/", canAccess, getUser);
userRoutes.put("/update", canAccess, updateUser);
userRoutes.delete("/delete/:userId", canAccess, deleteUser);

module.exports = userRoutes;
