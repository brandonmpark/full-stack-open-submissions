import PropTypes from "prop-types";
import React from "react";
import Toggleable from "./Toggleable";

const Blog = ({ blog, removeBlog, updateBlog, user }) => {
	const handleLike = async () => {
		const newBlog = {
			author: blog.author,
			id: blog.id,
			likes: blog.likes + 1,
			title: blog.title,
			url: blog.url,
			user: blog.user,
		};
		await updateBlog(newBlog);
	};

	const handleDelete = async () => {
		if (window.confirm(`Delete ${blog.author} - "${blog.title}"`)) {
			await removeBlog(blog.id);
		}
	};

	return (
		<div className="blog">
			{blog.author} - &quot;{blog.title}&quot;
			<Toggleable buttonLabel="View" cancelLabel="Hide">
				<p>{blog.url}</p>
				<p>Likes: {blog.likes}</p>
				<button onClick={handleLike}>Like</button>
				<p>{user.name}</p>
				{user.id === blog.user.id ? (
					<button onClick={handleDelete}>Delete</button>
				) : null}
			</Toggleable>
		</div>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	removeBlog: PropTypes.func,
	updateBlog: PropTypes.func,
	user: PropTypes.object.isRequired,
};

export default Blog;
