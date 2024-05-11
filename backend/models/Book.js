// Filename: Model\book.js

import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  author: { type: String, required: true },
  language: { type: String, default: "" },
  image_url: { type: String, default: "/assets/image/ActiveBooks.png", unique: true },
  publisher: { type: String, default: "" },
  description: { type: String, default: "" },
  bookCountAvailable: { type: Number, required: true },
  bookCount: { type: Number, required: true },
  bookStatus: { type: String, default: "Sẵn có" },
  categories: { type: String, default: "" },
  staff_creat: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    // required: true
  },
  staff_edit: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    // required: true
  },
  transactions: [{ type: mongoose.Types.ObjectId, ref: "BookTransaction" }]
}, {
  timestamps: true
});

BookSchema.pre('save', function (next) {
  if (this.isNew) {
    this.image_url = `${this._id}.jpg`;
  }
  next();
});

const Book = mongoose.model("Book", BookSchema);

export default Book;

// CRUD Operations for Book model

// Create a new book
export const addBook = async (bookData) => {
  try {
    const newBook = await Book.create(bookData);
    return newBook;
  } catch (error) {
    throw new Error("Could not create book: " + error.message);
  }
};

// Read all books
export const getAllBooks = async () => {
  try {
    const allBooks = await Book.find();
    return allBooks;
  } catch (error) {
    throw new Error("Could not fetch books: " + error.message);
  }
};

// Read a single book by ID
export const getBookById = async (bookId) => {
  try {
    const book = await Book.findById(bookId);
    return book;
  } catch (error) {
    throw new Error("Could not find book: " + error.message);
  }
};

// Update a book by ID
export const updateBook = async (bookId, updatedData) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, { new: true });
    return updatedBook;
  } catch (error) {
    throw new Error("Could not update book: " + error.message);
  }
};

// Delete a book by ID
export const deleteBook = async (bookId) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return deletedBook;
  } catch (error) {
    throw new Error("Could not delete book: " + error.message);
  }
};
