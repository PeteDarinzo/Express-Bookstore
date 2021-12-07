
async function getAllBooks(e) {
    e.preventDefault();
    $("#books").empty(); // clear lists
    const res = await axios.get('http://localhost:3000/books');
    const books = res.data.books;
    for (let book of books) {
        // each book will be represented by a list of data
        // each list is itself an li
        $("#books").append(`<li><b>${book.title}</b><ul id="${book.isbn}"></ul></li>`);
        for (let data in book) {
            $(`#${book.isbn}`).append(`<li><b>${data}</b>: ${book[data]}</li>`);
        }
    }
};


async function searchByISBN(e) {
    e.preventDefault();
    $("#books").empty(); // clear lists
    const isbn = $("#isbn").val();
    const res = await axios.get(`http://localhost:3000/books/${isbn}`)
    const book = res.data.book;
    $("#books").append(`<li><b>${book.title}</b><ul id="${book.isbn}"></ul></li>`);
    for (let data in book) {
        $(`#${book.isbn}`).append(`<li><b>${data}</b>: ${book[data]}</li>`);
    }
    $("#isbn").val('');
}


async function makeNewBook(e) {
    e.preventDefault();
    $("#books").empty(); // clear lists
    let isbn = $("#new-isbn").val();
    let amazon_url = $("#amazon-url").val();
    let author = $("#author").val();
    let language = $("#language").val();
    let pages = $("#num-pages").val();
    let publisher = $("#publisher").val();
    let title = $("#title").val();
    let year = $("#year").val();
    pages = parseInt(pages);
    year = parseInt(year);

    const newBook = {
        isbn,
        amazon_url,
        author,
        language,
        pages,
        publisher,
        title,
        year
    }
    const res = await axios.post("http://localhost:3000/books/", newBook);

    console.log(res);

    $("#new-isbn").val('');
    $("#amazon-url").val('');
    $("#author").val('');
    $("#language").val('');
    $("#num-pages").val('');
    $("#publisher").val('');
    $("#title").val('');
    $("#year").val('');
}


async function updateBook(e) {
    e.preventDefault();
    $("#books").empty(); // clear lists
    let isbn = $("#update-isbn").val();
    let amazon_url = $("#update-amazon-url").val();
    let author = $("#update-author").val();
    let language = $("#update-language").val();
    let pages = $("#update-num-pages").val();
    let publisher = $("#update-publisher").val();
    let title = $("#update-title").val();
    let year = $("#update-year").val();
    pages = parseInt(pages);
    year = parseInt(year);


    const updateBook = {
        isbn,
        amazon_url,
        author,
        language,
        pages,
        publisher,
        title,
        year
    }

    const res = await axios.put(`http://localhost:3000/books/${isbn}`, updateBook);

    $("#update-isbn").val('');
    $("#update-amazon-url").val('');
    $("#update-author").val('');
    $("#update-language").val('');
    $("#update-num-pages").val('');
    $("#update-publisher").val('');
    $("#update-title").val('');
    $("#update-year").val('');
}


async function deleteBook(e) {
    e.preventDefault();
    $("#books").empty(); // clear lists
    const isbn = $("#delete-isbn").val();
    const res = await axios.delete(`http://localhost:3000/books/${isbn}`)
    $("#delete-isbn").val('');
}



$("#all-books-form").submit(getAllBooks);

$("#search-form").submit(searchByISBN);

$("#new-book-form").submit(makeNewBook);

$("#update-book-form").submit(updateBook);

$("#delete-form").submit(deleteBook);

