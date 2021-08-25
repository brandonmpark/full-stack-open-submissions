describe("Blog app", function () {
	beforeEach(function () {
		cy.request("POST", "http://localhost:3003/api/testing/reset");
		const user = {
			name: "admin",
			password: "password",
			username: "root",
		};
		cy.request("POST", "http://localhost:3003/api/users/", user);
	});

	it("Login form is shown", function () {
		cy.visit("http://localhost:3000");
		cy.contains("Login");
	});

	describe("Login", function () {
		beforeEach(function () {
			cy.visit("http://localhost:3000");
		});

		it("succeeds with correct credentials", function () {
			cy.get("input:first").type("root");
			cy.get("input:last").type("password");
			cy.get("button").click();
			cy.contains("Logged in as admin");
		});

		it("fails with wrong credentials", function () {
			cy.get("input:first").type("username");
			cy.get("input:last").type(";aldskjf");
			cy.get("button").click();
			cy.contains("Invalid credentials");
		});
	});

	describe("Blog app", function () {
		beforeEach(function () {
			cy.login({ password: "password", username: "root" });
		});

		it("blog form is shown", function () {
			cy.contains("Create new blog").click();
			cy.contains("Post new blog");
		});

		it("a blog can be created", function () {
			cy.contains("Create new blog").click();
			cy.contains("Post new blog");
			cy.get("input[name='Title']").type("test title");
			cy.get("input[name='Author']").type("test author");
			cy.get("input[name='Url']").type("http://testurl.com");
			cy.get("button").contains("Post").click();
			cy.contains('test author - "test title"');
		});

		describe("Blog functionalities", function () {
			beforeEach(function () {
				cy.createBlog({
					author: "test author",
					likes: 0,
					title: "test title",
					url: "test url",
				});

				cy.createBlog({
					author: "test author2",
					likes: 0,
					title: "test title2",
					url: "test url2",
				});
			});

			it("a blog can be liked", function () {
				cy.contains("View").click();
				cy.get("button").contains("Like").click();
				cy.contains("Likes: 1");
			});

			it("a blog can be deleted", function () {
				cy.contains("View").click();
				cy.get("button").contains("Delete").click();
				cy.get("html").should(
					"not.contain",
					'test author - "test title2"'
				);
			});
		});

		it.only("Blogs are sorted by likes", function () {
			cy.createBlog({
				author: "test author",
				likes: 1,
				title: "test title",
				url: "test url",
			});

			cy.createBlog({
				author: "test author2",
				likes: 3,
				title: "test title2",
				url: "test url2",
			});

			cy.createBlog({
				author: "test author3",
				likes: 2,
				title: "test title3",
				url: "test url3",
			});

			cy.get(".blog").then((blogs) => {
				blogs.map((i, blog) => {
					cy.wrap(blog).contains("View").click();
					cy.wrap(blog)
						.contains("Likes")
						.should("contain", 3 - i);
				});
			});

			cy.get(".blog")
				.contains("test title2")
				.get("button")
				.contains("Like")
				.click()
				.click();
			cy.get(".blog").eq(0).contains("test title2").contains("Likes: 4");
		});
	});
});
