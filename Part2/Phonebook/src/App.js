import React, { useEffect, useState } from "react";
import personService from "./services/persons";
import "./index.css";

const Search = ({ search, handleSearch }) => {
	return (
		<div>
			Search by name:
			<input value={search} onChange={handleSearch} />
		</div>
	);
};

const NewPerson = (props) => {
	return (
		<form>
			<div>
				Name: <input value={props.name} onChange={props.handleName} />
			</div>
			<div>
				Number:{" "}
				<input value={props.number} onChange={props.handleNumber} />
			</div>
			<button type="submit" onClick={props.handleSubmit}>
				add
			</button>
		</form>
	);
};

const Persons = ({ persons, search, handleDelete }) => {
	return (
		<table>
			<tbody>
				{persons
					.filter((person) =>
						person.name.toLowerCase().includes(search.toLowerCase())
					)
					.map((person) => (
						<tr key={person.id}>
							<td>{person.name}</td>
							<td>{person.number}</td>
							<td>
								<button
									onClick={() =>
										handleDelete(person.id, person)
									}
								>
									Delete
								</button>
							</td>
						</tr>
					))}
			</tbody>
		</table>
	);
};

const Notification = ({ message }) => {
	if (message === null) {
		return null;
	}
	return <div className={message.type}>{message.text}</div>;
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [search, setSearch] = useState("");
	const [message, setMessage] = useState(null);

	useEffect(() => {
		personService.getAll().then((response) => {
			setPersons(response.data);
		});
	}, []);

	const handleSearch = (event) => {
		setSearch(event.target.value);
	};

	const handleName = (event) => {
		setNewName(event.target.value);
	};

	const handleNumber = (event) => {
		setNewNumber(event.target.value);
	};

	const handleDelete = (id, person) => {
		if (window.confirm(`Delete ${person.name}?`)) {
			personService.remove(id).then(() => {
				setMessage({
					text: `${person.name} has been removed`,
					type: "success",
				});
				setTimeout(() => {
					setMessage(null);
				}, 5000);
			});
			setPersons(persons.filter((p) => p.id !== id));
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (
			persons.findIndex(
				(person) =>
					person.name.toLowerCase() === newName.toLowerCase().trim()
			) !== -1
		) {
			let person =
				persons[
					persons.findIndex(
						(person) =>
							person.name.toLowerCase() ===
							newName.toLowerCase().trim()
					)
				];
			if (window.confirm(`Replace ${person.name}'s number?`)) {
				personService
					.update(person.id, { ...person, number: newNumber })
					.then((response) => {
						setPersons(
							persons.map((p) =>
								p.id !== person.id ? p : response.data
							)
						);
					})
					.catch(() => {
						setMessage({
							text: `${person.name} has already been deleted`,
							type: "error",
						});
						setTimeout(() => {
							setMessage(null);
						}, 5000);
					});
			}
		} else if (
			persons.findIndex((person) => person.number === newNumber) !== -1
		) {
			setMessage({
				text: `The phone number ${newNumber} already exists`,
				type: "error",
			});
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		} else {
			personService
				.create({ name: newName.trim(), number: newNumber })
				.then((response) => {
					setPersons(persons.concat(response.data));
				})
				.then(() => {
					setMessage({
						text: `${newName} has been added`,
						type: "success",
					});
					setTimeout(() => {
						setMessage(null);
					}, 5000);
				});
		}
		setNewName("");
		setNewNumber("");
	};

	return (
		<div>
			<h2>Phonebook</h2>

			<Notification message={message} />

			<Search search={search} handleSearch={handleSearch} />

			<h2>Add New</h2>
			<NewPerson
				name={newName}
				number={newNumber}
				handleName={handleName}
				handleNumber={handleNumber}
				handleSubmit={handleSubmit}
			/>

			<h2>Numbers</h2>
			<Persons
				persons={persons}
				search={search}
				handleDelete={handleDelete}
			/>
		</div>
	);
};

export default App;
