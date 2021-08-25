import PropTypes from "prop-types";
import React, { useImperativeHandle, useState } from "react";

const Toggleable = React.forwardRef((props, ref) => {
	const [visible, setVisible] = useState(false);

	const hideWhenVisible = { display: visible ? "none" : "" };
	const showWhenVisible = { display: visible ? "" : "none" };

	const toggleVisibility = () => {
		setVisible(!visible);
	};

	useImperativeHandle(ref, () => {
		return {
			toggleVisibility,
		};
	});

	return (
		<div>
			<div style={hideWhenVisible}>
				<button onClick={toggleVisibility}>{props.buttonLabel}</button>
			</div>
			<div style={showWhenVisible}>
				<button onClick={toggleVisibility}>{props.cancelLabel}</button>
				{props.children}
			</div>
		</div>
	);
});

Toggleable.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
	cancelLabel: PropTypes.string.isRequired,
	children: PropTypes.node,
};

Toggleable.displayName = "Toggleable";

export default Toggleable;
