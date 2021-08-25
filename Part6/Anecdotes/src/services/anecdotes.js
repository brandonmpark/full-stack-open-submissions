import axios from "axios";
import { asObject } from "../reducers/anecdoteReducer";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

const createNew = async (anecdote) => {
	const response = await axios.post(baseUrl, asObject(anecdote));
	return response.data;
};

const vote = async (id) => {
	const response = await axios.get(`${baseUrl}/${id}`);
	await axios.put(`${baseUrl}/${id}`, {
		...response.data,
		votes: response.data.votes + 1,
	});
};

export default { createNew, getAll, vote };
