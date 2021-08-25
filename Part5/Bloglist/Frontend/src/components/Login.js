import PropTypes from "prop-types";
import React, { useState } from "react";

const Login = ({ login }) => {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");

	const handleChange = (e) => {
		const setters = {
			Password: setPassword,
			Username: setUsername,
		};
		setters[e.target.name](e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const user = {
			password,
			username,
		};

		login(user);

		setPassword("");
		setUsername("");
	};

	return (
		<>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div>
					Username:
					<input
						type="text"
						value={username}
						name="Username"
						onChange={handleChange}
					/>
				</div>
				<div>
					Password:
					<input
						type="password"
						value={password}
						name="Password"
						onChange={handleChange}
					/>
				</div>
				<button type="submit">Login</button>
			</form>
		</>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
};

export default Login;
