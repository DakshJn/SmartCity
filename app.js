//----------------Requirments--------------------
const express = require('express'),
      app = express(),
      bodyParser = require("body-parser"),
      expressSession = require("express-session"),
      mongoose = require("mongoose"),
	  request = require("request"),
	  passport = require("passport"),
	  local = require("passport-local").Strategy,
	  passLocalMong = require("passport-local-mongoose"),
	  user = require("./models/users");
var search_list;
//------------------------------------------------
mongoose.connect("mongodb://localhost:27017/cityNav_data",{useNewUrlParser: true,useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(expressSession({
	secret: "cse sem2 project",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());

passport.use(new local(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//---------------Routes----------------------------
app.get("/",(req,res) =>{
	var url = "https://api.tomtom.com/search/2/poiCategories.json?key=UMgEdp0NIAjZ1RnylvWfZtrLwpcQAJHA";
	res.render("home",{currentUser:req.user});
});
// ---------sigin routes----------
app.get("/signin",(req,res) =>{
	res.render("signin",{currentUser:req.user});
})
app.post("/signin",passport.authenticate("local",{
	successRedirect: "/",
	failureRedirect: "/signin",
	failureFlash: true}),
	(req,res) =>{
})
// ----------signup routes--------
app.get("/signup",(req,res) =>{
	res.render("signup",{currentUser:req.user});
})
app.post("/signup",(req,res) =>{
		
	user.register(new user({
	username: req.body.username,
	uname: req.body.uname,
		
	}), req.body.password, function(err,user){
		if(err){
			console.log(err);
			console.log(req.body.username);
			return res.render('signup',{currentUser:req.user})
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		});
	});
})
// ------------logout route---------------
app.get("/logout",(req,res) =>{
// 	logout
	req.logout();
	res.redirect("/");
})
// --------------------------------
app.get("/covid",(req,res) =>{
	res.render("covid",{currentUser:req.user})
})
//----------------Listener-------------------------
app.listen(8080, () => {
	console.log("Listening for requests");
})
      