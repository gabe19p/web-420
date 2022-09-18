/*
============================================
; Title:  purselley-user.js
; Author: Danial Purselley
; Date:   15 Sep 2022
; Description: user API
;===========================================
*/

// require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user schema
let userSchema = new Schema({
  userName: { type: String },
  password: { type: String },
  emailAddress: { type: String },
});

// export the model
module.exports = mongoose.model("User", userSchema);
