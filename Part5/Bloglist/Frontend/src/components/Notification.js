import PropTypes from "prop-types";
import React from "react";


const Notification = ({ message }) => {
	return message ? <div>{message}</div> : null;
};

Notification.propTypes = {
	message: PropTypes.string.isRequired,
};

export default Notification;
