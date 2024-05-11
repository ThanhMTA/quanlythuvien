import mongoose from "mongoose";

const BookTransactionSchema = new mongoose.Schema({
    borrowerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    books: { type: mongoose.Types.ObjectId, ref: "Book" },
    transactionType: {
        type: String,
        required: true,
    },
    fromDate: {
        type: String,
        required: true,
    },
    toDate: {
        type: String,
        required: true,
    },
    returnDate: {
        type: String
    },
    transactionStatus: {
        type: String,
        default: "Active"
    },
    staff_creat: {
        type: mongoose.Types.ObjectId,
        ref: "User",

    },
    staff_edit: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
});

const BookTransaction = mongoose.model("BookTransaction", BookTransactionSchema);

export default BookTransaction;

// CRUD Operations for BookTransaction model

// Create a new book transaction
export const addBookTransaction = async (transactionData) => {
    try {
        const newTransaction = await BookTransaction.create(transactionData);
        return newTransaction;
    } catch (error) {
        throw new Error("Could not create book transaction: " + error.message);
    }
};

// Read all book transactions
export const getAllBookTransactions = async () => {
    try {
        const allTransactions = await BookTransaction.find();
        return allTransactions;
    } catch (error) {
        throw new Error("Could not fetch book transactions: " + error.message);
    }
};

// Read a single book transaction by ID
export const getBookTransactionById = async (transactionId) => {
    try {
        const transaction = await BookTransaction.findById(transactionId);
        return transaction;
    } catch (error) {
        throw new Error("Could not find book transaction: " + error.message);
    }
};

// Update a book transaction by ID
export const updateBookTransaction = async (transactionId, updatedData) => {
    try {
        const updatedTransaction = await BookTransaction.findByIdAndUpdate(transactionId, updatedData, { new: true });
        return updatedTransaction;
    } catch (error) {
        throw new Error("Could not update book transaction: " + error.message);
    }
};

// Delete a book transaction by ID
export const deleteBookTransaction = async (transactionId) => {
    try {
        const deletedTransaction = await BookTransaction.findByIdAndDelete(transactionId);
        return deletedTransaction;
    } catch (error) {
        throw new Error("Could not delete book transaction: " + error.message);
    }
};
