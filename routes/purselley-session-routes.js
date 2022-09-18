/*
============================================
; Title:  purselley-session-routes.js
; Author: Danial Purselley
; Date:   15 Sep 2022
; Description: route for user session API
;===========================================
*/

// require statements
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/purselley-user");

// bcrypt salt hash
const saltRounds = 10;

/**
 * signup
 * @openapi
 * /api/signup:
 *   post:
 *     tags:
 *       - users
 *     description: API for registering a user document
 *     summary: creates a new user document
 *     requestBody:
 *       description: user information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *               - email
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Registered User
 *       '401':
 *         description: Username is already in use
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/signup", async (req, res) => {
  try {
    // variable assignment
    let userName = req.body.userName;
    let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    let email = req.body.email;

    // user document w/ the request body variables
    const newRegisteredUser = {
      userName: userName,
      password: hashedPassword,
      email: email,
    };

    // query the database to prevent duplicate userNames
    User.findOne({ userName: userName }, function (err, user) {
      // checking to see if 'user' from the function ^ is already
      // inside the database as a 'userName' from the query
      if (!user) {
        // if !user no user has that 'userName' proceed w/ create
        User.create(newRegisteredUser, function (err, user) {
          if (err) {
            // unsuccessful creation due to MongoDB
            console.log(err);
            res.status(501).send({
              message: `MongoDB Exception: ${err}`,
            });
          } else {
            // successful creation
            console.log(user);
            res.json(user);
          }
        });
      } else {
        // the userName already exists
        console.log("Username already in use");
        res.status(401).send({
          message: `Username is already in use`,
        });
      }
    });
  } catch (error) {
    // server issue
    console.log(error);
    res.status(500).send({
      message: `Server exception: ${error.message}`,
    });
  }
});

/**
 * login
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - users
 *     description: API to log users into their application
 *     summary: logs a user in w/ their credentials
 *     requestBody:
 *       description: user login information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in
 *       '401':
 *         description: Invalid username and/or password
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exceptions
 */
router.post("/login", async (req, res) => {
  try {
    // query the database with the userName parsed from the req.body
    User.findOne({ userName: req.body.userName }, function (err, user) {
      // if the user is found
      if (user) {
        // check the hashed password w/ bcrypt
        let passwordIsValid = bcrypt.compare(req.body.password, user.password);
        // correct password
        if (passwordIsValid) {
          console.log(user);
          res.status(200).send({
            message: `User logged in`,
          });
        } else {
          // incorrect password
          res.status(401).send({
            message: `Invalid username and/or password`,
          });
        }
      } else {
        // username not found
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      }
    });
  } catch (error) {
    // server issue
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

module.exports = router;
