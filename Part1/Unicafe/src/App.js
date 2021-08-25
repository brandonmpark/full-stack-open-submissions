import React, { useState } from "react";

const Feedback = ({ handleClick }) => {
	return (
		<>
			<h1>Give Feedback</h1>
			<Button text="Good" onClick={() => handleClick("good")} />
			<Button text="Neutral" onClick={() => handleClick("neutral")} />
			<Button text="Bad" onClick={() => handleClick("bad")} />
		</>
	);
};

const Button = ({ text, onClick }) => {
	return <button onClick={onClick}>{text}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
	if (good === 0 && neutral === 0 && bad === 0) {
		return (
			<>
				<h1>Statistics</h1>
				<p>No feedback given</p>
			</>
		);
	}
	return (
		<>
			<h1>Statistics</h1>
			<table>
				<tbody>
					<Statistic text="Good" value={good} />
					<Statistic text="Neutral" value={neutral} />
					<Statistic text="Bad" value={bad} />
					<Statistic text="All" value={good + neutral + bad} />
					<Statistic
						text="Average"
						value={(good - bad) / (good + neutral + bad)}
					/>
					<Statistic
						text="Positive"
						value={(good / (good + neutral + bad)) * 100 + "%"}
					/>
				</tbody>
			</table>
		</>
	);
};

const Statistic = ({ text, value }) => {
	return (
		<tr>
			<td>{text}:</td>
			<td>{value}</td>
		</tr>
	);
};

const App = () => {
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	const handleClick = (type) => {
		if (type === "good") {
			setGood(good + 1);
		} else if (type === "neutral") {
			setNeutral(neutral + 1);
		} else if (type === "bad") {
			setBad(bad + 1);
		}
	};

	return (
		<div>
			<Feedback handleClick={handleClick} />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	);
};

export default App;
