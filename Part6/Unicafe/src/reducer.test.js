import deepFreeze from "deep-freeze";
import counterReducer from "./reducer";

describe("unicafe reducer", () => {
	const initialState = {
		bad: 0,
		good: 0,
		ok: 0,
	};

	test("should return a proper initial state when called with undefined state", () => {
		const action = {
			type: "DO_NOTHING",
		};

		const newState = counterReducer(undefined, action);
		expect(newState).toEqual(initialState);
	});

    test("bad is incremented", () => {
		const action = {
			type: "BAD",
		};
		const state = initialState;

		deepFreeze(state);
		const newState = counterReducer(state, action);
		expect(newState).toEqual({
			bad: 1,
			good: 0,
			ok: 0,
		});
	});

	test("good is incremented", () => {
		const action = {
			type: "GOOD",
		};
		const state = initialState;

		deepFreeze(state);
		const newState = counterReducer(state, action);
		expect(newState).toEqual({
			bad: 0,
			good: 1,
			ok: 0,
		});
	});

    test("ok is incremented", () => {
		const action = {
			type: "OK",
		};
		const state = initialState;

		deepFreeze(state);
		const newState = counterReducer(state, action);
		expect(newState).toEqual({
			bad: 0,
			good: 0,
			ok: 1,
		});
	});
});
