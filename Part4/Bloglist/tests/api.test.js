const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const saltRounds = 10;

beforeEach(async () => {
	await User.deleteMany({});

	let root;

	for (let user of helper.initialUsers) {
		let newUser = JSON.parse(JSON.stringify(user));
		const passwordHash = await bcrypt.hash(newUser.password, saltRounds);
		delete newUser.password;
		newUser = new User({ ...newUser, passwordHash });
		if (newUser.username === "root") {
			root = newUser;
		}
		await newUser.save();
	}

	await Blog.deleteMany({});

	for (let blog of helper.initialBlogs) {
		let newBlog = JSON.parse(JSON.stringify(blog));
		newBlog = new Blog({ ...newBlog, user: root.id });
		root.blogs = root.blogs.concat(newBlog._id);
		await newBlog.save();
	}

	await root.save();
});

describe("initial state", () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("users are returned as json", async () => {
		await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all blogs are returned", async () => {
		const blogResponse = await api.get("/api/blogs");
		expect(blogResponse.body).toHaveLength(helper.initialBlogs.length);
	});

	test("all users are returned", async () => {
		const userResponse = await api.get("/api/users");
		expect(userResponse.body).toHaveLength(helper.initialUsers.length);
	});

	test("all blogs have an id", async () => {
		const blogResponse = await api.get("/api/blogs");
		blogResponse.body.forEach((blog) => expect(blog.id).toBeDefined());
	});

	test("all users have an id", async () => {
		const userResponse = await api.get("/api/users");
		userResponse.body.forEach((user) => expect(user.id).toBeDefined());
	});

	test("a specific blog is within the returned blogs", async () => {
		const blogResponse = await api.get("/api/blogs");
		const titles = blogResponse.body.map((r) => r.title);
		expect(titles).toContain("React patterns");
	});

	test("a specific user is within the returned users", async () => {
		const userResponse = await api.get("/api/users");
		const usernames = userResponse.body.map((r) => r.username);
		expect(usernames).toContain("someUser");
	});

	test("all blogs have the root user as their creator", async () => {
		const blogResponse = await api.get("/api/blogs");
		const userResponse = await api.get("/api/users");
		const rootUser = userResponse.body[0];
		blogResponse.body.forEach((blog) => {
			expect(blog.user.id).toBe(rootUser.id);
			expect(blog.user.username).toBe(rootUser.username);
		});
	});

	test("the root user has all the blogs", async () => {
		const userResponse = await api.get("/api/users");
		const rootUser = userResponse.body[0];
		expect(rootUser.blogs).toHaveLength(helper.initialBlogs.length);
		const titles = rootUser.blogs.map((r) => r.title);
		expect(titles).toContain("React patterns");
	});

	test("the non-root user has no blogs", async () => {
		const userResponse = await api.get("/api/users");
		const user = userResponse.body[1];
		expect(user.blogs).toHaveLength(0);
	});
});

describe("logging in", () => {
	test("the root user can login with the correct credentials", async () => {
		const rootUser = {
			username: "root",
			password: "hunter2",
		};

		await api
			.post("/api/login")
			.send(rootUser)
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("logging in will return the token and username", async () => {
		const rootUser = {
			username: "root",
			password: "hunter2",
		};

		const response = await api
			.post("/api/login")
			.send(rootUser)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		expect(response.body.username).toBe(rootUser.username);
		const decodedToken = jwt.verify(response.body.token, config.SECRET);
		const user = await User.findById(decodedToken.id);
		expect(user.username).toBe(rootUser.username);
	});

	test("attempting to login without a username will fail", async () => {
		const user = {
			password: "hunter2",
		};

		await api.post("/api/login").send(user).expect(400);
	});

	test("attempting to login without a password will fail", async () => {
		const user = {
			username: "root",
		};

		await api.post("/api/login").send(user).expect(400);
	});

	test("attempting to login with an incorrect password will fail", async () => {
		const user = {
			username: "root",
			password: "password",
		};

		await api.post("/api/login").send(user).expect(401);
	});

	test("attempting to login with a nonexistent user will fail", async () => {
		const user = {
			username: "user",
			password: "password",
		};

		await api.post("/api/login").send(user).expect(401);
	});
});

describe("posting a blog", () => {
	test("a valid blog can be added", async () => {
		const newBlog = JSON.parse(JSON.stringify(helper.testBlog));
		const userResponse = await api.get("/api/users");
		let user = userResponse.body[1];
		user = { username: user.username, id: user.id };
		const token = jwt.sign(user, config.SECRET);

		await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", `bearer ${token}`)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const newBlogs = await helper.blogsInDb();
		expect(newBlogs).toHaveLength(helper.initialBlogs.length + 1);

		const titles = newBlogs.map((r) => r.title);
		expect(titles).toContain(newBlog.title);
	});

	test("a new blog will be assigned to the correct user", async () => {
		const newBlog = JSON.parse(JSON.stringify(helper.testBlog));
		const userResponse = await api.get("/api/users");
		let user = userResponse.body[1];
		user = { username: user.username, id: user.id };
		const token = jwt.sign(user, config.SECRET);

		const response = await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", `bearer ${token}`)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.user).toEqual(user.id);

		const users = await helper.usersInDb();

		expect(users[1].blogs).toContainEqual(
			mongoose.Types.ObjectId(response.body.id)
		);
	});

	test("a blog without an author can be added", async () => {
		const newBlog = JSON.parse(JSON.stringify(helper.testBlog));
		delete newBlog.author;
		const userResponse = await api.get("/api/users");
		let user = userResponse.body[1];
		user = { username: user.username, id: user.id };
		const token = jwt.sign(user, config.SECRET);

		await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", `bearer ${token}`)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const newBlogs = await helper.blogsInDb();
		expect(newBlogs).toHaveLength(helper.initialBlogs.length + 1);
	});

	test("a blog without any likes will have a default of 0", async () => {
		const newBlog = JSON.parse(JSON.stringify(helper.testBlog));
		delete newBlog.likes;
		const userResponse = await api.get("/api/users");
		let user = userResponse.body[1];
		user = { username: user.username, id: user.id };
		const token = jwt.sign(user, config.SECRET);

		const response = await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", `bearer ${token}`)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.likes).toBe(0);

		const newBlogs = await helper.blogsInDb();
		expect(newBlogs).toHaveLength(helper.initialBlogs.length + 1);
	});

	test("attempting to add a blog without a title will fail", async () => {
		const newBlog = JSON.parse(JSON.stringify(helper.testBlog));
		delete newBlog.title;
		const userResponse = await api.get("/api/users");
		let user = userResponse.body[1];
		user = { username: user.username, id: user.id };
		const token = jwt.sign(user, config.SECRET);

		await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", `bearer ${token}`)
			.expect(400);

		const newBlogs = await helper.blogsInDb();
		expect(newBlogs).toHaveLength(helper.initialBlogs.length);
	});

	test("attempting to add a blog without a url will fail", async () => {
		const newBlog = JSON.parse(JSON.stringify(helper.testBlog));
		delete newBlog.url;
		const userResponse = await api.get("/api/users");
		let user = userResponse.body[1];
		user = { username: user.username, id: user.id };
		const token = jwt.sign(user, config.SECRET);

		await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", `bearer ${token}`)
			.expect(400);

		const newBlogs = await helper.blogsInDb();
		expect(newBlogs).toHaveLength(helper.initialBlogs.length);
	});

	test("attempting to add a blog without a token will fail", async () => {
		const newBlog = JSON.parse(JSON.stringify(helper.testBlog));

		await api.post("/api/blogs").send(newBlog).expect(401);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
