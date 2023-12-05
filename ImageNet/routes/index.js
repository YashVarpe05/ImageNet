var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.authenticate(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.post("/register", (req, res) => {
	const { username, email, fullname } = req.body;
	const userData = new userModel({
		username,
		email,
		fullname,
	});

	userModel.register(userData, req.body.password).then(() => {
		passport.authenticate("local")(req, res, () => {
			res.redirect("/profile");
		});
	});
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/profile",
		failureRedirect: "/",
	}),
	(req, res) => {}
);

router.get("/logout", (req, res) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});
module.exports = router;
