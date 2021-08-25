const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (_request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
	});
	response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
	const blog = await Blog.findById(request.params.id).populate("user", {
		username: 1,
		name: 1,
	});
	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogsRouter.post("/", async (request, response) => {
	const body = request.body;
	const user = request.user;

    if (!user) {
        return response.status(401).end();
    }

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id,
	});

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
	const body = request.body;
	const user = request.user;

    if (!user) {
		return response.status(401).end();
	}

	if (!user.blogs.includes(request.params.id)) {
		return response.status(401).end();
	}

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
		runValidators: true,
	});

	response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
	const user = request.user;

    if (!user) {
		return response.status(401).end();
	}

	if (!user.blogs.includes(request.params.id)) {
		return response.status(401).end();
	}

	await Blog.findByIdAndRemove(request.params.id);
	user.blogs = user.blogs.filter((blog) => blog !== request.params.id);
	response.status(204).end();
});

module.exports = blogsRouter;
