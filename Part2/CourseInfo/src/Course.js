import React from "react";

const Header = ({ course }) => {
	return <h1>{course.name}</h1>;
};

const Course = ({ course }) => {
	return (
		<>
			<Header course={course} />
			<Content course={course} />
			<Total course={course} />
		</>
	);
};

const Content = ({ course }) => {
	return course.parts.map((part) => <Part key={part.id} part={part} />);
};

const Part = ({ part }) => {
	return (
		<p>
			{part.name} {part.exercises}
		</p>
	);
};

const Total = ({ course }) => {
	return (
		<strong>
			Total of{" "}
			{course.parts.reduce((total, part) => total + part.exercises, 0)}{" "}
			exercises
		</strong>
	);
};

export default Course;
