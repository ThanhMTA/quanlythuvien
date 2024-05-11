// Filename: Model\bookCategory.js

import mongoose from "mongoose";

const BookCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    unique: true
  },
  books: [{
    type: mongoose.Types.ObjectId,
    ref: "Book"
  }]
}, {
  timestamps: true
});

const BookCategory = mongoose.model("BookCategory", BookCategorySchema);

export default BookCategory;

// CRUD Operations for BookCategory model

// Create a new book category
export const addBookCategory = async (categoryData) => {
  try {
    const newCategory = await BookCategory.create(categoryData);
    return newCategory;
  } catch (error) {
    throw new Error("Could not create book category: " + error.message);
  }
};

// Read all book categories
export const getAllBookCategories = async () => {
  try {
    const allCategories = await BookCategory.find();
    return allCategories;
  } catch (error) {
    throw new Error("Could not fetch book categories: " + error.message);
  }
};

// Read a single book category by ID
export const getBookCategoryById = async (categoryId) => {
  try {
    const category = await BookCategory.findById(categoryId);
    return category;
  } catch (error) {
    throw new Error("Could not find book category: " + error.message);
  }
};

// Update a book category by ID
export const updateBookCategory = async (categoryId, updatedData) => {
  try {
    const updatedCategory = await BookCategory.findByIdAndUpdate(categoryId, updatedData, { new: true });
    return updatedCategory;
  } catch (error) {
    throw new Error("Could not update book category: " + error.message);
  }
};

// Delete a book category by ID
export const deleteBookCategory = async (categoryId) => {
  try {
    const deletedCategory = await BookCategory.findByIdAndDelete(categoryId);
    return deletedCategory;
  } catch (error) {
    throw new Error("Could not delete book category: " + error.message);
  }
};
