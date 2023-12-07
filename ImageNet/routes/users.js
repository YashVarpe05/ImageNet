const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ImageNet");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
		unique: true,
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	],
	password: {
		type: String,
	},
	dp: {
		type: String,
	},
	email: {
		type: String,
		require: true,
		unique: true,
	},
	fullname: {
		type: String,
		require: true,
	},
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
