import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeFilter } from "../reducers/filterReducer";

const Filter = () => {
	const filter = useSelector((state) => state.filter);
	const dispatch = useDispatch();

	const handleChange = (event) => {
		dispatch(changeFilter(event.target.value));
	};

	const style = {
		marginBottom: 10,
	};

	return (
		<div style={style}>
			filter <input onChange={handleChange} value={filter} />
		</div>
	);
};

export default Filter;
