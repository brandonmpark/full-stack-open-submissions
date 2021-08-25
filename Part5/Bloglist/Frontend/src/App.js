import BlogDisplay from "./components/BlogDisplay";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import Login from "./components/Login";
import Notification from "./components/Notification";
import React, { useEffect, useRef, useState } from "react";
import Toggleable from "./components/Toggleable";
import loginService from "./services/login";
import _ from "lodash";

const timeout = 5000;

const App = () => {
	const [notification, setNotification] = useState("");
	const [sortedBlogs, setSortedBlogs] = useState([]);
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);

	const blogFormRef = useRef();

	useEffect(() => {
		blogService.getAll().then((newBlogs) => setBlogs(newBlogs));
	}, []);

	useEffect(() => {
		const loggedUser = window.localStorage.getItem("loggedUser");
		if (loggedUser) {
			const newUser = JSON.parse(loggedUser);
			setUser(newUser);
			blogService.setToken(newUser.token);
		}
	}, []);

	useEffect(() => {
		const sorted = _.cloneDeep(blogs);
		sorted.sort((a, b) => b.likes - a.likes);
		setSortedBlogs(sorted);
	}, [blogs]);

	const login = async (newUser) => {
		try {
			const loggedUser = await loginService.login(newUser);
            console.log(loggedUser);
			window.localStorage.setItem(
				"loggedUser",
				JSON.stringify(loggedUser)
			);
			blogService.setToken(loggedUser.token);
			setUser(loggedUser);
			setNotification("Login successful");
			setTimeout(() => {
				setNotification("");
			}, timeout);
		} catch (exception) {
			setNotification("Invalid credentials");
			setTimeout(() => {
				setNotification("");
			}, timeout);
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem("loggedUser");
		blogService.setToken(null);
		setUser(null);
		setNotification("Logged out");
		setTimeout(() => {
			setNotification("");
		}, timeout);
	};

	const createBlog = async (blog) => {
		try {
			const newBlog = await blogService.create(blog);
			const newBlogs = [...blogs];
			newBlogs.push(newBlog);
			console.log(newBlog);
			setBlogs(newBlogs);
			setNotification("Blog posted");
			setTimeout(() => {
				setNotification("");
			}, timeout);
			blogFormRef.current.toggleVisibility();
		} catch (exception) {
			setNotification("Invalid blog");
			setTimeout(() => {
				setNotification("");
			}, timeout);
		}
	};

	const updateBlog = async (blog) => {
		try {
			const newBlog = await blogService.update(blog);
			const newBlogs = blogs.filter((b) => b.id !== blog.id);
			newBlog.user = user;
			newBlogs.push(newBlog);
			setBlogs(newBlogs);
			setNotification("Blog updated");
			setTimeout(() => {
				setNotification("");
			}, timeout);
		} catch (exception) {
			setNotification(`Update operation failed: ${exception.message}`);
			setTimeout(() => {
				setNotification("");
			}, timeout);
		}
	};

	const removeBlog = async (id) => {
		try {
			await blogService.remove(id);
			const newBlogs = blogs.filter((blog) => blog.id !== id);
			setBlogs(newBlogs);
			setNotification("Blog deleted");
			setTimeout(() => {
				setNotification("");
			}, timeout);
		} catch (exception) {
			setNotification(`Delete operation failed: ${exception.message}`);
			setTimeout(() => {
				setNotification("");
			}, timeout);
		}
	};

	return (
		<>
			<Notification message={notification} />
			{user === null ? (
				<Login login={login} />
			) : (
				<>
					<p>Logged in as {user.name}</p>
					<button onClick={handleLogout}>Logout</button>
					<Toggleable
						buttonLabel="Create new blog"
						cancelLabel="cancel"
						ref={blogFormRef}
					>
						<BlogForm createBlog={createBlog} />
					</Toggleable>
					<BlogDisplay
						blogs={sortedBlogs}
						user={user}
						updateBlog={updateBlog}
						removeBlog={removeBlog}
					/>
				</>
			)}
		</>
	);
};

export default App;
