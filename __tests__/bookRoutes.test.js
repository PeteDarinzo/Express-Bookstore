process.env.NODE_ENV = "test";

const { response } = require("express");
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

let b1;

describe("Book Routes Test)", function () {

    beforeEach(async function () {
        await db.query("DELETE FROM books");

        b1 = await Book.create({
            "isbn": "1234567891011",
            "amazon_url": "https://www.book.com/mybook",
            "author": "Test Author",
            "language": "english",
            "pages": 100,
            "publisher": "Test Publisher",
            "title": "Test Book",
            "year": 2020
        });

    });


    describe("GET books/", function () {

        test("can get all books", async function () {
            let response = await request(app).get('/books/');

            let books = response.body;

            expect(response.statusCode).toBe(200);

            expect(books).toEqual({
                books: [{
                    "isbn": "1234567891011",
                    "amazon_url": "https://www.book.com/mybook",
                    "author": "Test Author",
                    "language": "english",
                    "pages": 100,
                    "publisher": "Test Publisher",
                    "title": "Test Book",
                    "year": 2020
                }]
            });
        });

    });


    describe("GET books/:isbn", function () {

        test("can get a book by isbn", async function () {
            let response = await request(app).get(`/books/${b1.isbn}`);

            let book = response.body;

            expect(response.statusCode).toBe(200);

            expect(book).toEqual({
                book: {
                    "isbn": "1234567891011",
                    "amazon_url": "https://www.book.com/mybook",
                    "author": "Test Author",
                    "language": "english",
                    "pages": 100,
                    "publisher": "Test Publisher",
                    "title": "Test Book",
                    "year": 2020
                }
            });
        });

        test("can't get a nonexistent book", async function () {
            let response = await request(app).get('/books/12345');

            let book = response.body;

            expect(response.statusCode).toBe(404);

            expect(book).toEqual({
                "error": {
                    "message": "There is no book with an isbn '12345'",
                    "status": 404
                },
                "message": "There is no book with an isbn '12345'"
            });
        });

    });


    describe("POST books/", function () {

        test("can create a new book", async function () {
            let response = await request(app).post('/books/')
                .send({
                    "isbn": "1110987654321",
                    "amazon_url": "https://www.book.com/myotherbook",
                    "author": "Test Author",
                    "language": "english",
                    "pages": 101,
                    "publisher": "Test Publisher 2",
                    "title": "Test Book 2",
                    "year": 2021
                });

            let book = response.body;

            expect(response.statusCode).toBe(201);
            expect(book).toEqual({
                book: {
                    "isbn": "1110987654321",
                    "amazon_url": "https://www.book.com/myotherbook",
                    "author": "Test Author",
                    "language": "english",
                    "pages": 101,
                    "publisher": "Test Publisher 2",
                    "title": "Test Book 2",
                    "year": 2021
                }
            });
        });

        test("can't create a new book with strings in place of numbers", async function () {
            let response = await request(app).post('/books/')
                .send({
                    "isbn": "1110987654321",
                    "amazon_url": "https://www.book.com/myotherbook",
                    "author": "Test Author",
                    "language": "english",
                    "pages": "ONE HUNDRED ONE",
                    "publisher": "Test Publisher 2",
                    "title": "Test Book 2",
                    "year": "TWENTY TWENTY"
                });

            let book = response.body;

            expect(response.statusCode).toBe(400);
            expect(book).toEqual({
                "error": {
                    "message": [
                        "instance.pages is not of a type(s) integer",
                        "instance.year is not of a type(s) integer"
                    ],
                    "status": 400
                },
                "message": [
                    "instance.pages is not of a type(s) integer",
                    "instance.year is not of a type(s) integer"
                ]
            });
        });


        test("can't create a new book with numbers in place of strings", async function () {
            let response = await request(app).post('/books/')
                .send({
                    "isbn": 123456789,
                    "amazon_url": "https://www.book.com/myotherbook",
                    "author": "Test Author",
                    "language": "english",
                    "pages": 101,
                    "publisher": "Test Publisher 2",
                    "title": "Test Book 2",
                    "year": 2020
                });

            let book = response.body;

            expect(response.statusCode).toBe(400);
            expect(book).toEqual({
                "error": {
                    "message": [
                        "instance.isbn is not of a type(s) string"
                    ],
                    "status": 400
                },
                "message": [
                    "instance.isbn is not of a type(s) string"
                ]
            });
        });


        test("can't create a new book with missing data", async function () {
            let response = await request(app).post('/books/')
                .send({
                    "isbn": "123456789",
                    "author": "Test Author",
                    "language": "english",
                    "pages": 101,
                    "title": "Test Book 2",
                    "year": 2020
                });

            let book = response.body;

            expect(response.statusCode).toBe(400);
            expect(book).toEqual({
                "error": {
                    "message": [
                        "instance requires property \"amazon_url\"",
                        "instance requires property \"publisher\""
                    ],
                    "status": 400
                },
                "message": [
                    "instance requires property \"amazon_url\"",
                    "instance requires property \"publisher\""
                ]
            });
        });

    });


    describe("PUT books/:isbn", function () {

        test("can update a book", async function () {
            let response = await request(app).put(`/books/${b1.isbn}`)
                .send({
                    "isbn": "1234567891011",
                    "amazon_url": "https://www.book.com/myotherbook",
                    "author": "New Test Author",
                    "language": "english",
                    "pages": 50,
                    "publisher": "New Test Publisher",
                    "title": "New Book Title",
                    "year": 1992
                });

            let book = response.body;

            expect(response.statusCode).toBe(200);
            expect(book).toEqual({
                book: {
                    "isbn": "1234567891011",
                    "amazon_url": "https://www.book.com/myotherbook",
                    "author": "New Test Author",
                    "language": "english",
                    "pages": 50,
                    "publisher": "New Test Publisher",
                    "title": "New Book Title",
                    "year": 1992
                }
            });
        });


        test("can't update a nonexistent book", async function () {
            let response = await request(app).put('/books/12345')
                .send({
                    "isbn": "1234567891011",
                    "amazon_url": "https://www.book.com/myotherbook",
                    "author": "New Test Author",
                    "language": "english",
                    "pages": 50,
                    "publisher": "New Test Publisher",
                    "title": "New Book Title",
                    "year": 1992
                });

            let book = response.body;

            expect(response.statusCode).toBe(404);
            expect(book).toEqual({
                "error": {
                    "message": "There is no book with an isbn '12345'",
                    "status": 404
                },
                "message": "There is no book with an isbn '12345'"
            });
        });



        test("can't update a book with strings in place of numbers", async function () {
            let response = await request(app).put(`/books/${b1.isbn}`)
                .send({
                    "isbn": "1110987654321",
                    "amazon_url": "https://www.book.com/myotherbook",
                    "author": "Test Author",
                    "language": "english",
                    "pages": "ONE HUNDRED ONE",
                    "publisher": "Test Publisher 2",
                    "title": "Test Book 2",
                    "year": "TWENTY TWENTY"
                });

            let book = response.body;

            expect(response.statusCode).toBe(400);
            expect(book).toEqual({
                "error": {
                    "message": [
                        "instance.pages is not of a type(s) integer",
                        "instance.year is not of a type(s) integer"
                    ],
                    "status": 400
                },
                "message": [
                    "instance.pages is not of a type(s) integer",
                    "instance.year is not of a type(s) integer"
                ]
            });
        });


        test("can't update a book with numbers in place of strings", async function () {
            let response = await request(app).put(`/books/${b1.isbn}`)
                .send({
                    "isbn": 123456789,
                    "amazon_url": "https://www.book.com/myotherbook",
                    "author": "Test Author",
                    "language": "english",
                    "pages": 101,
                    "publisher": "Test Publisher 2",
                    "title": "Test Book 2",
                    "year": 2020
                });

            let book = response.body;

            expect(response.statusCode).toBe(400);
            expect(book).toEqual({
                "error": {
                    "message": [
                        "instance.isbn is not of a type(s) string"
                    ],
                    "status": 400
                },
                "message": [
                    "instance.isbn is not of a type(s) string"
                ]
            });
        });


        test("can't update a book with missing data", async function () {
            let response = await request(app).put(`/books/${b1.isbn}`)
                .send({
                    "isbn": "123456789",
                    "author": "Test Author",
                    "language": "english",
                    "pages": 101,
                    "title": "Test Book 2",
                    "year": 2020
                });

            let book = response.body;

            expect(response.statusCode).toBe(400);
            expect(book).toEqual({
                "error": {
                    "message": [
                        "instance requires property \"amazon_url\"",
                        "instance requires property \"publisher\""
                    ],
                    "status": 400
                },
                "message": [
                    "instance requires property \"amazon_url\"",
                    "instance requires property \"publisher\""
                ]
            });
        });

    });



    describe("DELETE books/:isbn", function () {

        test("can delete a book", async function () {
            let response = await request(app).delete(`/books/${b1.isbn}`);

            let book = response.body;

            expect(response.statusCode).toBe(200);
            expect(book).toEqual({
                message: "Book deleted"
            });
        });

        test("can't delete a nonexistent book", async function () {
            let response = await request(app).delete(`/books/12345`);

            let book = response.body;

            expect(response.statusCode).toBe(404);
            expect(book).toEqual({
                "error": {
                    "message": "There is no book with an isbn '12345'",
                    "status": 404
                },
                "message": "There is no book with an isbn '12345'"
            });
        });
    });


});



afterAll(async function () {
    await db.end();
});