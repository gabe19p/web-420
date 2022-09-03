/*
============================================
; Title:  purselley-composer.js
; Author: Danial Purselley
; Date:   3 Sep 2022
; Description: model for composer API
;===========================================
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let composerSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
});

module.exports = mongoose.model("Composer", composerSchema);
