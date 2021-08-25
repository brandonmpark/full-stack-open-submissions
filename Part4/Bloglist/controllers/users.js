const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs", {
		title: 1,
		author: 1,
		url: 1,
	});
	response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
	const user = await User.findById(request.params.id).populate("blogs", {
		title: 1,
		author: 1,
		url: 1,
	});
	if (user) {
		response.json(user);
	} else {
		response.status(404).end();
	}
});

usersRouter.post("/", async (request, response) => {
	const body = request.body;
	const saltRounds = 10;

	if (body.password && body.password.length < 3) {
		return response.status(400).json({ error: "password too short" });
	}
	if (body.username && body.username.length < 3) {
		return response.status(400).json({ error: "username too short" });
	}

	const passwordHash = await bcrypt.hash(body.password, saltRounds);

	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash,
	});

	const savedUser = await user.save();

	response.status(201).json(savedUser);
});

module.exports = usersRouter;
