const express = require("express");
const router = express.Router();
const { createUser, login, getUser, follow, unFollow } = require("../Controllers/userController");
const { verifyToken } = require("../Config/jwt");

// Create User {sign up}
router.post("/createUser", createUser);

// Login
router.post("/login", login);

//Get User
router.get("/getUser/:id",verifyToken, getUser);

// Follow User
router.post("/follow/:user_id/:follow_id",verifyToken,follow);

// UnFollow User
router.post("/unFollow/:user_id/:follows_id",verifyToken,unFollow);

module.exports = router;