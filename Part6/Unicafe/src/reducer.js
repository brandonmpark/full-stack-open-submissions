const initialState = {
	bad: 0,
	good: 0,
	ok: 0,
};

const counterReducer = (state = initialState, action) => {
	console.log(action);
	switch (action.type) {
		case "BAD":
			return { ...state, bad: state.bad + 1 };
		case "GOOD":
			return { ...state, good: state.good + 1 };
		case "OK":
			return { ...state, ok: state.ok + 1 };
		case "ZERO":
			return initialState;
		default:
			return state;
	}
};

export default counterReducer;
