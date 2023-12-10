var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require("./multer");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
	res.render("login");
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
	const user = await userModel
		.findOne({ username: req.session.passport.user })
		.populate("posts");
	res.render("profile", { user });
});
router.get("/show/posts", isLoggedIn, async (req, res, next) => {
	const user = await userModel
		.findOne({ username: req.session.passport.user })
		.populate("posts");
	res.render("show", { user });
});
router.get("/add", isLoggedIn, async (req, res, next) => {
	const user = await userModel.findOne({ username: req.session.passport.user });

	res.render("add", { user });
});
router.post(
	"/createpost",
	isLoggedIn,
	upload.single("postimage"),
	async (req, res, next) => {
		const user = await userModel.findOne({
			username: req.session.passport.user,
		});
		const post = await postModel.create({
			user: user._id,
			title: req.body.title,
			description: req.body.description,
			image: req.file.filename,
		});
		user.posts.push(post._id);
		await user.save();
		res.redirect("/profile");
	}
);
router.post(
	"/fileupload",
	isLoggedIn,
	upload.single("image"),
	async (req, res, next) => {
		const user = await userModel.findOne({
			username: req.session.passport.user,
		});
		user.profileImage = req.file.filename;
		await user.save();
		res.redirect("/profile");
	}
);
router.get("/feed", isLoggedIn, async (req, res) => {
	// res.render("feed");
	const user = await userModel.findOne({ username: req.session.passport.user });
	const posts = await postModel.find().populate("user");

	res.render("feed", { user, posts, nav: true });
});
router.post("/register", (req, res) => {
	const { username, email, fullname, contact } = req.body;
	const userData = new userModel({
		username,
		email,
		fullname,
		contact,
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
		failureRedirect: "/login",
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

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}
module.exports = router;
