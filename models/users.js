const mongoose = require("mongoose"),
	  passLocalMong = require("passport-local-mongoose");



var usrSchema = new mongoose.Schema({
	username: String,
	uname: String,
	password:String
});

usrSchema.plugin(passLocalMong);

module.exports = mongoose.model("user",usrSchema);