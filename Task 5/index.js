// Task 4: Search and Filter Functionality (Day 5)
// Objective: Learn how to filter and search data.
// Description:
//  Extend the Book Store API by adding search and filter functionality:
// GET books by author (filter by query parameters).
// GET books within a certain price range (filter by query parameters).
// GET books by genre (filter by query parameters).

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hellooooooo World!");
});

app.get("/books/genre/:genre", (req, res) => {
  const { genre } = req.params;

  fs.readFile("./books.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error, Books not found");
    }

    const books = JSON.parse(data);
    const filteredBooks = books.filter(
      (book) => book.genre.toLowerCase() === genre.toLowerCase()
    );
    res.json(filteredBooks);
  });
});

// app.get("/books/author/:author", (req, res) => {
//   const { author } = req.params;

//   fs.readFile("./books.json", "utf8", (err, data) => {
//     if (err) {
//       res.status(500).send("Internal Server Error, Books not found");
//     }
//     const books = JSON.parse(data);
//     const filteredBooks = books.filter(
//       (book) => book.author.toLowerCase() === author.toLowerCase()
//     );
//     res.json(filteredBooks);
//   });
// });

app.get("/books", (req, res) => {
  fs.readFile("./books.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Internal Server Error, Books not found");
    }

    const books = JSON.parse(data);
    let filteredBooks= [...books];
    // if (req.query.genre) {
    //   filteredBooks = books.filter(
    //     (book) => book.genre.toLowerCase() === req.query.genre.toLowerCase()
    //   );
    // }

    // if (req.query.author) {
    //   filteredBooks = books.filter(
    //     (book) => book.author.includes(req.query.author.toLowerCase())
    //   );

      if (req.query.author) {
    const searchName = req.query.author.toLowerCase();
    result = result.filter(book => 
      book.author.toLowerCase().includes(searchName)
    );
  }
      
    else {
      filteredBooks = books;
    }
    res.json(filteredBooks);
  });
});

app.get("/books/price", (req, res) => {
  const min = parseFloat(req.query.min) || 8;
  const max = parseFloat(req.query.max) || 12;

  fs.readFile("./books.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Internal Server Error, Books not found");
    }
    const books = JSON.parse(data);
    const filteredBooks = books.filter(
      (book) => book.price >= min && book.price <= max
    );
    res.json(filteredBooks);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

export default app;
