/*
============================================
; Title:  purselley-customer.js
; Author: Danial Purselley
; Date:   23 Sep 2022
; Description: model for customer API
;===========================================
*/

// require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// item schema
let lineItemSchema = new Schema({
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
});

// invoice schema
let invoiceSchema = new Schema({
  subtotal: { type: Number },
  tax: { type: Number },
  dateCreated: { type: String },
  dateShipped: { type: String },
  lineItems: [lineItemSchema],
});

// customer schema
let customerSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  invoices: [invoiceSchema],
});

// export the module
module.exports = mongoose.model("Customer", customerSchema);
