/*
============================================
; Title:  purselley-composer-routes.js
; Author: Danial Purselley
; Date:   3 Sep 2022
; Description: route for composer API
;===========================================
*/

const express = require("express");
const { db } = require("../models/purselley-composer");
const router = express.Router();
const Composer = require("../models/purselley-composer");

/**
 * findAllComposers
 * @openapi
 * /api/composers:
 *   get:
 *     tags:
 *       - Composers
 *     description: API for returning an array of composer documents.
 *     summary: returns an array of composers documents in JSON format.
 *     responses:
 *       '200':
 *         description: array of composer documents.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
router.get("/composers", async (req, res) => {
  try {
    Composer.find({}, function (err, composers) {
      if (err) {
        // unsuccessful query
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        // successful query
        console.log(composers);
        res.json(composers);
      }
    });
  } catch (e) {
    // error message
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

/**
 * findComposerById
 * @openapi
 * /api/composers/{id}:
 *   get:
 *     tags:
 *       - Composers
 *     description:  API for returning a composer document by Id
 *     summary: returns a composer document
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: composer document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Composer document
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/composers/:id", async (req, res) => {
  try {
    Composer.findOne({ _id: req.params.id }, function (err, composer) {
      if (err) {
        // unsuccessful query
        console.log(err);
        res.status(500).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        // successful query
        console.log(composer);
        res.json(composer);
      }
    });
  } catch (e) {
    // error message
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

/**
 * createComposer
 * @openapi
 * /api/composers:
 *   post:
 *     tags:
 *       - Composers
 *     description: API for adding a new composer document to MongoDB Atlas
 *     summary: creates a new composer document
 *     requestBody:
 *       description: composer information
 *       content:
 *        application/json:
 *          schema:
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Composer added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/composers", async (req, res) => {
  try {
    const newComposer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    await Composer.create(newComposer, function (err, composer) {
      if (err) {
        // unsuccessful creation
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        // successful creation
        console.log(composer);
        res.json(composer);
      }
    });
  } catch (e) {
    // error
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

/**
 * updateComposerById
 * @openapi
 * /api/composers/{id}:
 *   put:
 *     tags:
 *       - Composers
 *     description: API for updated a composer by their Id
 *     summary: update a composer's first & last name
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: composer document id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: composer information
 *       content:
 *        application/json:
 *          schema:
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Composer document
 *       '401':
 *         description: Invalid composerId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.put("/composers/:id", async (req, res) => {
  try {
    // query the db to find a composer w/ the parameter
    Composer.findOne({ _id: req.params.id }, function (err, composer) {
      // if mongoDB errors out
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      }
      // if a composer is found
      if (composer) {
        // update composer w/ request body
        composer.set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        });
        // save the document
        composer.save(function (err, updatedComposer) {
          // if mongoDB errors out
          if (err) {
            console.log(err);
            res.status(501).send({
              message: `MongoDB Exception: ${err}`,
            });
          } else {
            // composer successfully updated
            console.log(updatedComposer);
            res.json(updatedComposer);
          }
        }); // end document save
      }
      // no composer found
      if (!composer) {
        console.log("Invalid ComposerId");
        res.status(401).send({
          message: `Invalid ComposerId`,
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

/**
 * deleteComposerById
 * @openapi
 * /api/composers/{id}:
 *   delete:
 *     tags:
 *       - Composers
 *     description: API for deleting a composer
 *     summary: delete a composer from the collection
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: id of composer f/ query
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Composer document
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete("/composers/:id", async (req, res) => {
  try {
    // find the composer in the collection
    Composer.findByIdAndDelete(
      { _id: req.params.id },
      function (err, deletedComposer) {
        // mongoDB error
        if (err) {
          console.log(err);
          res.status(501).send({ message: `MongoDB Exception: ${err}` });
        } else {
          // list composer that was just deleted
          console.log(deletedComposer);
          console.log("-- Deleted --");
          res.json(deletedComposer);
        }
      } // end function
    ); // end find&delete
  } catch (error) {
    // server error
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

module.exports = router;
