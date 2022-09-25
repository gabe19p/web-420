/*
============================================
; Title:  purselley-node-shopper-routes.js
; Author: Danial Purselley
; Date:   23 Sep 2022
; Description: route for composer API
;===========================================
*/

// import statements
const express = require("express");
const router = express.Router();
const Customer = require("../models/purselley-customer");

// createCustomer
// createInvoiceByUserName
// findAllInvoicesByUserName

/**
 * createCustomer
 * @openapi
 * /api/customers:
 *   post:
 *     tags:
 *       - Customers
 *     description: API for creating a new customer
 *     summary: creates a new customer document
 *     requestBody:
 *       description: customer information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - userName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Customer created
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/customers", async (req, res) => {
  try {
    // new customer variable
    let newCustomer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
    };

    // mongoDB customer creation
    Customer.create(newCustomer, function (err, customer) {
      if (err) {
        // mongoDB error
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        // successful creation
        console.log(customer);
        res.json(customer);
      }
    }); // end of customer creation
  } catch (error) {
    // server error
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  } // end catch
});

/**
 * createInvoiceByUserName
 * @openapi
 * /api/customers/{username}/invoices:
 *   post:
 *     tags:
 *       - Customers
 *     description: API for creating customer invoice
 *     summary: creates an invoice document within the customer
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: username to search the collection
 *         schema:
 *           type: string
 *     requestBody:
 *       description: invoice information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - subtotal
 *               - tax
 *               - dateCreated
 *               - dateShipped
 *               - lineItems
 *             properties:
 *               subtotal:
 *                 type: string
 *               tax:
 *                 type: string
 *               dateCreated:
 *                 type: string
 *               dateShipped:
 *                 type: string
 *               lineItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *     responses:
 *       '200':
 *         description: invoice created
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/customers/:username/invoices", async (req, res) => {
  const user = req.params.username;
  try {
    Customer.findOne({ userName: user }, function (err, foundUser) {
      // invoice variable
      let newInvoice = {
        subtotal: req.body.subtotal,
        tax: req.body.tax,
        dateCreated: req.body.dateCreated,
        dateShipped: req.body.dateShipped,
        lineItems: req.body.lineItems,
      };
      if (err) {
        // unsuccessful query
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(foundUser);
        foundUser.set({
          invoices: newInvoice,
        });
        foundUser.save(function (err, invoice) {
          if (err) {
            console.log(err);
            res.json(invoice);
          } else {
            console.log(invoice);
            res.json(invoice);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

/**
 * findAllInvoicesByUserName
 * @openapi
 * /api/customers/{username}/invoices:
 *   get:
 *     tags:
 *       - Customers
 *     description:
 *     summary:
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: username to search the collection
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Customer added to MongoDB
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/customers/:username/invoices", async (req, res) => {
  try {
    // mongodb query
    Customer.findOne(
      { username: req.params.username },
      function (err, invoice) {
        if (err) {
          // couldn't find the user
          console.log(err);
          res.status(501).send({
            message: `MongoDB Exception: ${err}`,
          });
        } else {
          //user found
          console.log(invoice);
          res.json(invoice);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Server Exception: ${error.message}`,
    });
  }
});

module.exports = router;
