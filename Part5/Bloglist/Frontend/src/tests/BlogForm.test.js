import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import BlogForm from "../Components/BlogForm";

describe("<BlogForm />", () => {
	test("submitting form calls handler", () => {
		const mockHandler = jest.fn();

		const component = render(<BlogForm createBlog={mockHandler} />);

		const inputs = [...component.container.querySelectorAll("input")];
		const form = component.container.querySelector("form");

		inputs.forEach((input) => {
			fireEvent.change(input, {
				target: { value: "input value" },
			});
		});
		fireEvent.submit(form);

		expect(mockHandler.mock.calls).toHaveLength(1);
		expect(mockHandler.mock.calls[0][0].author).toBe(
			"input value"
		);
	});
});
