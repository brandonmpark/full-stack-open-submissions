const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) =>
	blogs.length === 0
		? null
		: blogs.reduce((favorite, blog) =>
				blog.likes > favorite.likes ? blog : favorite
		  );

const mostBlogs = (blogs) => {
	const authors = {};
	blogs.forEach((blog) => {
		if (!authors.hasOwnProperty(blog.author)) {
			authors[blog.author] = 0;
		}
		authors[blog.author]++;
	});
	if (Object.keys(authors).length === 0) {
		return null;
	} else {
		maxAuthor = Object.keys(authors).reduce((max, author) =>
			authors[author] > authors[max] ? author : max
		);
		return {
			author: maxAuthor,
			blogs: authors[maxAuthor],
		};
	}
};

const mostLikes = (blogs) => {
	const authors = {};
	blogs.forEach((blog) => {
		if (!authors.hasOwnProperty(blog.author)) {
			authors[blog.author] = 0;
		}
		authors[blog.author] += blog.likes;
	});
	if (Object.keys(authors).length === 0) {
		return null;
	} else {
		maxAuthor = Object.keys(authors).reduce((max, author) =>
			authors[author] > authors[max] ? author : max
		);
		return {
			author: maxAuthor,
			likes: authors[maxAuthor],
		};
	}
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
