import Dao from './Dao.js';
import BookTransaction from '../models/BookTransaction.js';

class BookTransactionDao extends Dao {
    constructor() {
        super(BookTransaction);
    }

    // Create a new book transaction
    async addBookTransaction(transactionData) {
        try {
            const newTransaction = await this.save(transactionData);
            return newTransaction;
        } catch (error) {
            throw new Error("Could not create book transaction: " + error.message);
        }
    }
    // Read all book transactions
    async getAllBookTransactions() {
        try {
            const allTransactions = await this.getAll();
            return allTransactions;
        } catch (error) {
            throw new Error("Could not fetch book transactions: " + error.message);
        }
    }
    async getBookTransactions(userId) {
        try {
            const Transactions = await BookTransaction.find({ borrowerId: userId }).exec();
            return Transactions;
        } catch (error) {
            throw new Error("Could not fetch book transactions: " + error.message);
        }
    }

    // Read a single book transaction by ID
    async getBookTransactionById(transactionId) {
        try {
            const transaction = await this.getById(transactionId);
            return transaction;
        } catch (error) {
            throw new Error("Could not find book transaction: " + error.message);
        }
    }

    // Update a book transaction by ID
    async updateBookTransaction(transactionId, updatedData) {
        try {
            const updatedTransaction = await this.update(transactionId, updatedData);
            return updatedTransaction;
        } catch (error) {
            throw new Error("Could not update book transaction: " + error.message);
        }
    }
    async updateBookTransaction_Status(transactionId, updatedData) {
        try {
            // Lấy dữ liệu cập nhật của giao dịch từ tham số truyền vào
            const { transactionStatus } = updatedData;
            let updatedTransaction
            if (transactionStatus == "False") {
               const returnDate = new Date()
                updatedTransaction = await this.update(transactionId, { transactionStatus, returnDate });
            }
            else {
                updatedTransaction = await this.update(transactionId, { transactionStatus });

            }
            // Tiến hành cập nhật trường transactionStatus của giao dịch


            return updatedTransaction;
        } catch (error) {
            throw new Error("Could not update book transaction: " + error.message);
        }
    }

    // Delete a book transaction by ID
    async deleteBookTransaction(transactionId) {
        try {
            const deletedTransaction = await this.delete(transactionId);
            return deletedTransaction;
        } catch (error) {
            throw new Error("Could not delete book transaction: " + error.message);
        }
    }
    async countBookTransaction() {
        try {
            const count = await this.model.count();
            return count;
        } catch (error) {
            throw new Error("Could not count bookTransaction: " + error.message);
        }
    }
}

export default BookTransactionDao;
