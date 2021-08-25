import React from "react";
import { useSelector } from "react-redux";

const Notification = () => {
	const notification = useSelector((state) => state.notification);
	const style = {
		border: "solid",
		borderWidth: 1,
		padding: 10,
	};
	return notification ? <div style={style}>{notification}</div> : null;
};

export default Notification;
