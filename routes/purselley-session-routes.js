/*
============================================
; Title:  purselley-session-routes.js
; Author: Danial Purselley
; Date:   15 Sep 2022
; Description: route for user session API
;===========================================
*/

// require statments
const express = require("express");
const router = express.Router();
const User = require("../models/purselley-user");
const bcrypt = require("bcryptjs");

// bcrypt salt hash
const saltRounds = 10;

router.post("/signup", async (req, res) => {
  // user variable for query
  let user = req.body.userName;
  try {
    User.findOne({ userName: user });
    if (!user) {
      // request body variables
      let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
      let email = req.body.email;
      // new user variable to be inserted
      let newRegisteredUser = {
        userName: user,
        password: hashedPassword,
        emailAddress: email,
      };
      User.create(newRegisteredUser);
    } else {
    }
  } catch (error) {}
});
