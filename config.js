/** Common config for bookstore. */



/*** Springboard Method ***/

let DB_URI = `postgresql://`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/books-test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/books`;
}

/*** End Springboard Method ***/



/*** My Method ***/

// let DB_URI = {
//   host: "localhost",
//   user: "", // your username 
//   password: "", // your password
//   database: "" // LEAVE BLANK
// }

// DB_URI.database = (process.env.NODE_ENV === "test") ? "books_test" : "books";

/*** End my method ***/


module.exports = { DB_URI };