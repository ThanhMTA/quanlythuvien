

import BookTransactionBusiness from '../Business/BookTransactionBusiness.js'

class BookTransactionService {
    constructor() {
        this.bookTransaction = new BookTransactionBusiness();
    }

    // Create a new book transaction
    async addBookTransaction(transactionData) {
        try {
            const newTransaction = await this.bookTransaction.addBookTransaction(transactionData);
            return newTransaction;
        } catch (error) {
            throw new Error("Could not create book transaction: " + error.message);
        }
    }

    // Read all book transactions
    async getAllBookTransactions() {
        try {
            const allTransactions = await this.bookTransaction.getAllBookTransactions();
            return allTransactions;
        } catch (error) {
            throw new Error("Could not fetch book transactions: " + error.message);
        }
    }
    //  lay theo danh sach người dung 
    async getBookTransactions(userId) {
        try {
            const Transactions = await this.bookTransaction.getBookTransactions(userId);
            return Transactions;
        } catch (error) {
            throw new Error("Could not fetch book transactions: " + error.message);
        }
    }
    // Read a single book transaction by ID
    async getBookTransactionById(transactionId) {
        try {
            const transaction = await this.bookTransaction.getBookTransactionById(transactionId);
            return transaction;
        } catch (error) {
            throw new Error("Could not find book transaction: " + error.message);
        }
    }
    // Update a book transaction by ID
    async updateBookTransaction(transactionId, updatedData) {
        try {
            const updatedTransaction = await this.bookTransaction.updateBookTransaction(transactionId, updatedData);
            return updatedTransaction;
        } catch (error) {
            throw new Error("Could not update book transaction: " + error.message);
        }
    }
    // update status 
    async updateBookTransaction_Status(transactionId, updatedData) {
        try {
            const { transactionStatus } = updatedData;
            if (transactionStatus == "True") {
                const updatedTransaction = await this.bookTransaction.updateBookTransaction_Status_true(transactionId, updatedData);
                return updatedTransaction;
            }
            if (transactionStatus == "False") {
                const updatedTransaction = await this.bookTransaction.updateBookTransaction_Status_False(transactionId, updatedData);
                return updatedTransaction;

            }

        } catch (error) {
            throw new Error("Could not update book transaction: " + error.message);
        }
    }
    // Delete a book transaction by ID
    async deleteBookTransaction(transactionId) {
        try {
            const deletedTransaction = await this.bookTransaction.deleteBookTransaction(transactionId);
            return deletedTransaction;
        } catch (error) {
            throw new Error("Could not delete book transaction: " + error.message);
        }
    }
    async countBookTransaction() {
        try {
            const count = await this.bookTransaction.countBookTransaction();
            return count;
        } catch (error) {
            throw new Error("Could not count bookTransaction: " + error.message);
        }
    }
}

export default BookTransactionService;
