const initialState = "";

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_NOTIFICATION":
			return action.data.message;
		default:
			return state;
	}
};

export const setNotification = (message, time) => {
	return async (dispatch) => {
		dispatch({
			data: { message },
			type: "SET_NOTIFICATION",
		});
		await new Promise((resolve) => {
			setTimeout(resolve, time * 1000);
		});
		dispatch({
			data: { message: "" },
			type: "SET_NOTIFICATION",
		});
	};
};

export default reducer;
