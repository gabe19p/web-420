/*
============================================
; Title:  purselley-teams.js
; Author: Danial Purselley
; Date:   4 Oct 2022
; Description: model for teams API
; that corresponds to capstone
;===========================================
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let playerSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  salary: { type: Number },
});

let teamSchema = new Schema({
  name: { type: String },
  mascot: { type: String },
  players: [playerSchema],
});

module.exports = mongoose.model("Team", teamSchema);
