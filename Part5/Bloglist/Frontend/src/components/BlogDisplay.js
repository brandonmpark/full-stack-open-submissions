import Blog from "./Blog";
import PropTypes from "prop-types";
import React from "react";

const BlogDisplay = ({ blogs, removeBlog, updateBlog, user }) => (
	<>
		<h2>Blogs</h2>
		{blogs.map((blog) => (
			<Blog
				key={blog.id}
				blog={blog}
				user={user}
				updateBlog={updateBlog}
				removeBlog={removeBlog}
			/>
		))}
	</>
);

BlogDisplay.propTypes = {
	blogs: PropTypes.array.isRequired,
	removeBlog: PropTypes.func,
	updateBlog: PropTypes.func,
	user: PropTypes.object.isRequired,
};

export default BlogDisplay;
