import anecdoteService from "../services/anecdotes";

const BIG_NUMBER = 100000;
const getId = () => (BIG_NUMBER * Math.random()).toFixed(0);

export const asObject = (anecdote) => {
	return {
		content: anecdote,
		id: getId(),
		votes: 0,
	};
};

const reducer = (state = [], action) => {
	switch (action.type) {
		case "VOTE": {
			const id = action.data.id;
			let anecdote = state.find((n) => n.id === id);
			anecdote = { ...anecdote, votes: anecdote.votes + 1 };
			return state.map((a) => (a.id === id ? anecdote : a));
		}
		case "CREATE_ANECDOTE":
			return [...state, action.data];
		case "INIT_ANECDOTES":
			return action.data;
		default:
			return state;
	}
};

export const voteFor = (id) => {
	return async (dispatch) => {
		await anecdoteService.vote(id);
		dispatch({
			data: { id },
			type: "VOTE",
		});
	};
};

export const createAnecdote = (anecdote) => {
	return async (dispatch) => {
		const newAnecdote = await anecdoteService.createNew(anecdote);
		dispatch({
			data: newAnecdote,
			type: "CREATE_ANECDOTE",
		});
	};
};

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await anecdoteService.getAll();
		dispatch({
			data: anecdotes,
			type: "INIT_ANECDOTES",
		});
	};
};

export default reducer;
