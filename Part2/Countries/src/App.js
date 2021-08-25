import React, { useEffect, useState } from "react";
import axios from "axios";

const CountryDisplay = ({ countries, handleClick }) => {
	if (countries.length > 10) {
		return <p>Too many matches, specify another filter</p>;
	} else if (countries.length > 1) {
		return countries.map((country) => (
			<div key={country.name}>
				<p>{country.name}</p>
				<button onClick={() => handleClick(country)}>search</button>
			</div>
		));
	} else if (countries.length > 0) {
		return <Country country={countries[0]} />;
	} else {
		return <p>No matches found</p>;
	}
};

const Country = ({ country }) => {
	const [weather, setWeather] = useState([]);

	useEffect(() => {
		axios
			.get(
				`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.name}`
			)
			.then((response) => {
				setWeather(response.data.current);
			});
	}, []);

	return (
		<>
			<h1>{country.name}</h1>
			<p>
				Capital: {country.capital} <br /> Population:{" "}
				{country.population}
			</p>
			<h2>Languages:</h2>
			<ul>
				{country.languages.map((language) => (
					<li key={language.name}>{language.name}</li>
				))}
			</ul>
			<img
				height="150px"
				src={country.flag}
				alt={`flag of ${country.name}`}
			/>
			<h2>Weather in {country.name}:</h2>
			<div>
				<strong>Temperature: </strong>
				{weather.temperature}&deg;C
			</div>
			<img
				src={weather.weather_icons}
				alt={`weather of ${country.name}`}
			/>
			<div>
				<strong>Wind Speed: </strong>
				{weather.wind_speed} mph {weather.wind_dir}
			</div>
		</>
	);
};

const App = () => {
	const [countries, setCountries] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
			setCountries(response.data);
		});
	}, []);

	const handleSearch = (event) => {
		setSearch(event.target.value);
	};

	const handleClick = (country) => {
		setSearch(country.name);
	};

	let filtered = countries.filter((country) =>
		country.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div>
			<div>
				Find Countries <input value={search} onChange={handleSearch} />
			</div>
			<CountryDisplay countries={filtered} handleClick={handleClick} />
		</div>
	);
};

export default App;
