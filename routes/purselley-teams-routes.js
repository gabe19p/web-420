/*
============================================
; Title:  purselley-teams-routes.js
; Author: Danial Purselley
; Date:   4 Oct 2022
; Description: route for teams API capstone
;===========================================
*/

// import statements
const express = require("express");
const router = express.Router();
const Team = require("../models/purselley-teams");

/**
 * createTeam
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     description: API for creating a team
 *     summary: creates a team document
 *     requestBody:
 *       description: player information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - mascot
 *             properties:
 *               name:
 *                 type: string
 *               mascot:
 *                 type: string
 *     responses:
 *       '200':
 *         description: team document
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/teams", async (req, res) => {
  try {
    // assign req body to a variable
    let newTeam = {
      name: req.body.name,
      mascot: req.body.mascot,
    };
    // create the new team
    Team.create(newTeam, function (err, team) {
      // if theres an error creating the team
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        // successful team creation
        console.log(team);
        res.json(team);
      }
    });
  } catch (error) {
    // catch if a server error
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

/**
 * assignPlayerToTeam
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     tags:
 *       - Teams
 *     description: API for creating player documents in a team
 *     summary: creates an player document within the team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: team object id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: player information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       '200':
 *         description: player document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/teams/:id/players", async (req, res) => {
  try {
    // set variable for teamId in parameters
    const teamId = req.params.id;
    // new player variable
    let newPlayer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      salary: req.body.salary,
    };
    // query the database with the parameters
    Team.findOne({ _id: teamId }, function (err, team) {
      if (err) {
        // if error finding team
        console.log(err);
        res.status(401).send({ message: `Invalid teamId` });
      } else {
        // update the team document with the parameters
        Team.updateOne(
          { _id: teamId },
          {
            $addToSet: {
              players: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                salary: req.body.salary,
              },
            },
          },
          function (err, updatedTeam) {
            if (err) {
              // issue updating team
              console.log(err);
              res.status(501).send({
                message: `MongoDB Exception: ${err}`,
              });
            } else {
              // successful team member update
              console.log(newPlayer);
              res.json(newPlayer);
            } // end else
          } // end function
        ); // end update
      } //  end else
    }); // end query
  } catch (error) {
    // catch if server error
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

/**
 * findAllTeams
 * @openapi
 * /api/teams:
 *   get:
 *     tags:
 *       - Teams
 *     description: API for finding all teams in a database
 *     summary: returns team documents for the entire database
 *     responses:
 *       '200':
 *         description: array of team documents
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/teams", async (req, res) => {
  try {
    // query teams collection for all documents
    Team.find({}, function (err, teams) {
      if (err) {
        //if query is unsuccessful
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        // successful query
        console.log(teams);
        res.json(teams);
      }
    }); // end team.find query
  } catch (error) {
    // server error
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

/**
 * findAllPlayersByTeamId
 * @openapi
 * /api/teams/{id}/players:
 *   get:
 *     tags:
 *       - Teams
 *     description: API for returning players of a specific team id
 *     summary: returns all documents within the team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: teams document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: array of player documents
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/teams/:id/players", async (req, res) => {
  try {
    // variable for request parameter
    const teamId = req.params.id;
    // query the teams collection
    Team.findOne({ _id: teamId }, function (err, players) {
      if (err) {
        // mongoDB error
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        // return team based on the id
        console.log(players);
        // respond w/ just players objects
        res.json(players.players);
      } // end else
    }); // end find query
  } catch (error) {
    // server error
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

/**
 * deleteTeamById
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     description: API for deleting a team document
 *     summary: delete a team document with the specified id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: object id of desired team to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Team document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete("/teams/:id", async (req, res) => {
  try {
    // variable for parameters
    const teamId = req.params.id;
    // find team query
    Team.findByIdAndDelete(teamId, function (err, team) {
      if (err) {
        // issue with mongodb
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      }
      // if you can't find the team
      if (!team) {
        console.log("Invalid teamId");
        res.status(401).send({
          message: `Invalid teamId`,
        });
      } else {
        // successful delete
        console.log(team);
        res.json(team);
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
