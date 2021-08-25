import PropTypes from "prop-types";
import React, { useState } from "react";

// eslint-disable-next-line max-lines-per-function
const BlogForm = ({ createBlog }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	const handleChange = (e) => {
		const setters = {
			Author: setAuthor,
			Title: setTitle,
			Url: setUrl,
		};
		setters[e.target.name](e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const blog = {
			author,
			title,
			url,
		};

		createBlog(blog);

		setAuthor("");
		setTitle("");
		setUrl("");
	};

	return (
		<>
			<h2>Post new blog</h2>
			<form onSubmit={handleSubmit}>
				<div>
					Title:
					<input
						type="text"
						value={title}
						name="Title"
						onChange={handleChange}
					/>
				</div>
				<div>
					Author:
					<input
						type="text"
						value={author}
						name="Author"
						onChange={handleChange}
					/>
				</div>
				<div>
					Url:
					<input
						type="text"
						value={url}
						name="Url"
						onChange={handleChange}
					/>
				</div>
				<button type="submit">Post</button>
			</form>
		</>
	);
};

BlogForm.propTypes = {
	createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
