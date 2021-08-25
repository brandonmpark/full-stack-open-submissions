import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import Blog from "../Components/Blog";

describe("<Blog />", () => {
	test("renders title and author", () => {
		const blog = {
			title: "title",
			author: "author",
			url: "url",
			likes: 1,
			user: {
				username: "username",
				name: "name",
			},
		};

		const user = {
			username: "username",
			name: "name",
		};

		const component = render(<Blog blog={blog} user={user} />);

		expect(component.container).toHaveTextContent(blog.title);
		expect(component.container).toHaveTextContent(blog.author);
		expect(
			component.getByText(`${blog.author} - "${blog.title}"`)
		).toBeVisible();
	});

	test("details are hidden by default", () => {
		const blog = {
			title: "title",
			author: "author",
			url: "url",
			likes: 1,
			user: {
				username: "username",
				name: "name",
			},
		};

		const user = {
			username: "username",
			name: "name",
		};

		const component = render(<Blog blog={blog} user={user} />);

		expect(component.getByText(blog.url)).not.toBeVisible();
		expect(component.getByText(`Likes: ${blog.likes}`)).not.toBeVisible();
		expect(component.getByText(user.name)).not.toBeVisible();
	});

	test("clicking view makes details visible, hide makes them invisible again", () => {
		const blog = {
			title: "title",
			author: "author",
			url: "url",
			likes: 1,
			user: {
				username: "username",
				name: "name",
			},
		};

		const user = {
			username: "username",
			name: "name",
		};

		const component = render(<Blog blog={blog} user={user} />);
		const viewButton = component.getByText("View");
		fireEvent.click(viewButton);

		expect(component.getByText(blog.url)).toBeVisible();
		expect(component.getByText(`Likes: ${blog.likes}`)).toBeVisible();
		expect(component.getByText(user.name)).toBeVisible();

		fireEvent.click(viewButton);

		expect(component.getByText(blog.url)).not.toBeVisible();
		expect(component.getByText(`Likes: ${blog.likes}`)).not.toBeVisible();
		expect(component.getByText(user.name)).not.toBeVisible();
	});

	test("clicking like twice calls handler twice", () => {
		const blog = {
			title: "title",
			author: "author",
			url: "url",
			likes: 1,
			user: {
				username: "username",
				name: "name",
			},
		};

		const user = {
			username: "username",
			name: "name",
		};

		const mockHandler = jest.fn();

		const component = render(
			<Blog blog={blog} user={user} updateBlog={mockHandler} />
		);
		const viewButton = component.getByText("View");
		fireEvent.click(viewButton);

		const likeButton = component.getByText("Like");
		fireEvent.click(likeButton);
		fireEvent.click(likeButton);

		expect(mockHandler.mock.calls).toHaveLength(2);
	});
});
