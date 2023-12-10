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
			ref: "post",
		},
	],
	password: {
		type: String,
	},
	profileImage: {
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
	contact: Number,
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
