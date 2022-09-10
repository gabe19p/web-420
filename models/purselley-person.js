/*
============================================
; Title:  purselley-person.js
; Author: Danial Purselley
; Date:   10 Sep 2022
; Description: person API
;===========================================
*/

// require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// roles schema
let roleSchema = new Schema({
  text: { type: String },
});

// dependents schema
let dependentSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
});

// person schema
let personSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  roles: [roleSchema],
  dependents: [dependentSchema],
  birthDate: { type: String },
});

// export model
module.exports = mongoose.model("Person", personSchema);
