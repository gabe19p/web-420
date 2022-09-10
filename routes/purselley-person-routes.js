/*
============================================
; Title:  purselley-person-routes.js
; Author: Danial Purselley
; Date:   10 Sep 2022
; Description: route for person API
;===========================================
*/

const express = require("express");
const router = express.Router();
const Person = require("../models/purselley-person");

/**
 * findAllPersons
 * @openapi
 * /api/persons:
 *   get:
 *     tags:
 *       - Persons
 *     description: API for returning an array of people
 *     summary: returns persons array in JSON
 *     responses:
 *       '200':
 *         description: array of persons
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/persons", async (req, res) => {
  try {
    Person.find({}, function (err, person) {
      if (err) {
        // unsuccessful query
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        // successful query
        console.log(person);
        res.json(person);
      }
    });
  } catch (error) {
    // error message
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

/**
 * createPerson
 * @openapi
 * /api/persons:
 *   post:
 *     tags:
 *       - Persons
 *     description: API for creating a person document
 *     summary: creates a new person document
 *     requestBody:
 *       description: person information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - roles
 *               - dependents
 *               - birthDate
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *               dependents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *               birthDate:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Person added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/persons", async (req, res) => {
  try {
    const newPerson = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      roles: req.body.roles,
      dependents: req.body.dependents,
      birthDate: req.body.birthDate,
    };

    // awaiting the newPerson variable to populate
    await Person.create(newPerson, function (err, person) {
      if (err) {
        // unsuccessful creation due to MongoDB
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        // successful creation
        console.log(person);
        res.json(person);
      }
    });
  } catch (error) {
    // user error
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

module.exports = router;
