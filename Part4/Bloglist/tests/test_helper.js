const Blog = require("../models/blog");
const User = require("../models/user");

const initialUsers = [
	{
		username: "root",
		name: "admin",
		password: "hunter2",
	},
	{
		username: "someUser",
		name: "aaron lo",
		password: "password123",
	},
];

const testUser = {
	username: "brandonmpark",
	name: "brandon park",
	password: "haha you thought",
};

const initialBlogs = [
	{
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
	},
	{
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
	},
	{
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
	},
];

const testBlog = {
	title: "First class tests",
	author: "Robert C. Martin",
	url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
	likes: 10,
};

const nonExistentBlogId = async () => {
	const blog = new Blog({
		title: "To be deleted",
		url: "To be deleted",
	});
	await blog.save();
	await blog.remove();

	return blog._id.toString();
};

const nonExistentUserId = async () => {
	const password = "To be deleted";
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username: "To be deleted",
		passwordHash,
	});
	await blog.save();
	await blog.remove();

	return blog._id.toString();
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

module.exports = {
	initialUsers,
	testUser,
	initialBlogs,
	testBlog,
	nonExistentBlogId,
	nonExistentUserId,
	blogsInDb,
	usersInDb,
};
