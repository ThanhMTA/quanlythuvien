
import BookTransactionDao from '../Dao/BookTransactionDao.js'
import Book, { updateBook } from '../models/Book.js';


class BookTransactionBusiness {
    constructor() {
        this.bookTransaction = new BookTransactionDao();
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
    //  lấy danh sách theo người dùng 
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
    async updateBookTransaction_Status_true(transactionId, updatedData) {
        try {
            // Lấy dữ liệu cập nhật của giao dịch từ tham số truyền vào
            const { transactionStatus } = updatedData;

            // Lấy thông tin chi tiết của giao dịch
            const transactionDetails = await this.bookTransaction.getBookTransactionById(transactionId);

            // Kiểm tra trạng thái trước khi cập nhật
            if (transactionDetails.transactionStatus !== "Active") {
                throw new Error("Transaction status must be 'Active' to update.");
            }

            // Lấy danh sách ID của các cuốn sách trong mảng books
            // const bookIds = transactionDetails.books.map(book => book._id);
            // if (bookIds.length === 0) {
            //     throw new Error("Transaction status must be have book to update.");
            // } else {
            //     for (const bookId of bookIds) {
            //         const book = await Book.findById(bookId);
            //         if (book.bookCount === 0) {
            //             // Xóa sách khỏi mảng books trong giao dịch
            //             await this.bookTransaction.removeBookFromTransaction(transactionId, bookId);
            //         }
            //     }

            // Cập nhật trạng thái của giao dịch
            const updatedTransaction = await this.bookTransaction.updateBookTransaction_Status(transactionId, updatedData);
            const NewtransactionDetails = await this.bookTransaction.getBookTransactionById(transactionId);
            const bookId = NewtransactionDetails.books
            // for (const bookId of newbookIds) {
            const book = await Book.findById(bookId);

            // Giảm số lượng sách hiện có của cuốn sách đi một
            book.bookCountAvailable -= 1;
            await book.save();

            // }
            return updatedTransaction;
            // }
            // Kiểm tra từng cuốn sách để xóa nếu bookCount = 0 và cập nhật số lượng sách hiện có

        } catch (error) {
            throw new Error("Could not update book transaction: " + error.message);
        }
    }
    // update stautus false 
    async updateBookTransaction_Status_False(transactionId, updatedData) {
        try {
            // Lấy dữ liệu cập nhật của giao dịch từ tham số truyền vào
            // Lấy thông tin chi tiết của giao dịch
            const transactionDetails = await this.bookTransaction.getBookTransactionById(transactionId);

            // Kiểm tra trạng thái trước khi cập nhật
            if (transactionDetails.transactionStatus !== "True") {
                throw new Error("Transaction status must be 'True' to update.");
            }
            // Cập nhật trạng thái của giao dịch
            const updatedTransaction = await this.bookTransaction.updateBookTransaction_Status(transactionId, updatedData);
            const NewtransactionDetails = await this.bookTransaction.getBookTransactionById(transactionId);
            const bookId = NewtransactionDetails.books
            // for (const bookId of newbookIds) {
            const book = await Book.findById(bookId);


            // Giảm số lượng sách hiện có của cuốn sách đi một
            book.bookCountAvailable += 1;
            await book.save();


            return updatedTransaction;
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

export default BookTransactionBusiness;
