import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { voteFor } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
	const anecdotes = useSelector((state) => state.anecdotes);
	const filter = useSelector((state) => state.filter);
	const dispatch = useDispatch();

	const vote = (id, content) => {
		dispatch(voteFor(id));
		dispatch(setNotification(`voted for ${content}`, 5));
	};

	return (
		<div>
			{anecdotes
				.filter((anecdote) =>
					anecdote.content.toLowerCase().includes(filter)
				)
				.sort((a, b) => b.votes - a.votes)
				.map((anecdote) => (
					<div key={anecdote.id}>
						<div>{anecdote.content}</div>
						<div>
							has {anecdote.votes}
							<button
								onClick={() =>
									vote(anecdote.id, anecdote.content)
								}
							>
								vote
							</button>
						</div>
					</div>
				))}
		</div>
	);
};

export default AnecdoteList;
