// Filename: controllers/bookTransaction.js
import BookTransactionService from '../Service/BookTransactionService.js';
import Notify from '../models/notify.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
// Create an instance of BookTransactionService to perform operations with the BookTransaction model
const BookTransaction = new BookTransactionService();

// Display a list of all book transactions
export const book_transaction_list = async (req, res) => {
    // if (req.body.isAdmin) {
    console.log('book transaction list controller');
    try {
        const transactions = await BookTransaction.getAllBookTransactions();
        if (transactions.length === 0) {
            res.send('NO TRANSACTIONS FOUND: No transactions found in database');
        } else {
            res.json(transactions);
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('Internal Server Error');
    }
    // }
    // else {
    //     return res.status(403).json("You dont have permission to get transaction!");
    // }
};
export const book_transaction_user = async (req, res) => {
    const userId = req.params.id;
    console.log('book transaction list controller');
    try {
        const transactions = await BookTransaction.getBookTransactions(userId);
        if (transactions.length === 0) {
            res.send('NO TRANSACTIONS FOUND: No transactions found in database');
        } else {
            res.json(transactions);
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('Internal Server Error');
    }
};
// Display details of a specific book transaction
export const book_transaction_detail = async (req, res) => {
    const transactionId = req.params.id;
    try {
        const transaction = await BookTransaction.getBookTransactionById(transactionId);
        if (!transaction) {
            res.send('TRANSACTION NOT FOUND: Transaction not found in database');
        } else {
            res.json(transaction);
        }
    } catch (error) {
        console.error('Error fetching transaction by ID:', error);
        res.status(500).send('Internal Server Error'); a
    }
};

// Display a form to create a book transaction
export const book_transaction_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book transaction create GET');
};

// Create a book transaction using the POST method
export const book_transaction_create_post = async (req, res) => {
    console.log('book transaction create controller post');
    const transactionData = req.body;
    console.log(transactionData);
    try {
        const newTransaction = await BookTransaction.addBookTransaction(transactionData);
        const bookId = newTransaction.books; // Lấy danh sách các _id sách từ transaction
        // const book = await Book.find({ _id:  bookIds  }); tìm kiếm nhiều 
        const book = await Book.findOne({ _id: bookId });
        const userId = newTransaction.borrowerId; // Lấy danh sách các _id sách từ transaction
        // const user = await User.find({ _id:  userId  });
        const user = await User.findOne({ _id: userId });

        console.log(user, book)
        const notifyData = {
            NotifyName: ` ${user.userFullName} yêu cầu mượn sách `,
            description: `${user.userFullName} yêu cầu mượn sách ${book.bookName}.`,
            NotifyStatus: 1,
            NotifyType: "create transactions",
            transactions: [newTransaction._id],
            books: [newTransaction.books],
            user: newTransaction.borrowerId
        };
        await Notify.create(notifyData);
        const result = {
            result: "success",
            message: "Book transaction inserted successfully",
            data: newTransaction
        };
        res.json(result);
    } catch (error) {
        console.error('Error adding book transaction:', error);
        const result = {
            result: "fail",
            message: "Could not add book transaction: " + error.message
        };
        res.json(result);
    }
};

// Display a form to update a book transaction
export const book_transaction_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book transaction update GET');
};

// Update a book transaction using the POST method
export const book_transaction_update_put = async (req, res) => {

    console.log('book transaction update controller [put]');
    const transactionId = req.params.id;
    const updatedData = req.body;
    console.log(updatedData);
    try {
        const updatedTransaction = await BookTransaction.updateBookTransaction(transactionId, updatedData);
        const result = {
            result: "success",
            message: "Book transaction updated successfully",
            data: updatedTransaction
        };
        console.log('TransactionUpdated', result);
        res.json(result);
    } catch (error) {
        console.error('Error updating book transaction:', error);
        const result = {
            result: "fail",
            message: "Could not update book transaction: " + error.message
        };
        res.json(result);
    }

};
export const book_transaction_status_put = async (req, res) => {
    // if (req.body.isAdmin) {
    console.log('book transaction update controller [put]');
    const transactionId = req.params.id;
    const updatedData = req.body;
    console.log(updatedData);
    try {
        const updatedTransaction = await BookTransaction.updateBookTransaction_Status(transactionId, updatedData);
        const bookIds = updatedTransaction.books; // Lấy danh sách các _id sách từ transaction
        const book = await Book.findOne({ _id: { $in: bookIds } });
        const userId = updatedTransaction.borrowerId; // Lấy danh sách các _id sách từ transaction
        const user = await User.findOne({ _id: { $in: userId } });
        if (updatedTransaction.transactionStatus === 'True') {
            // Nếu transactionStatus là true (đã mượn sách), tạo thông báo cho việc mượn sách


            const notifyData = {
                NotifyName: `Đã xử lý phiếu mượn ${updatedTransaction._id}`,
                description: ` cuốn sách ${book.bookName} đã bàn giao cho ${user.userFullName}`,
                NotifyStatus: 1,
                NotifyType: "borrow books",
                transactions: [updatedTransaction._id],
                books: [updatedTransaction.books],
                user: [updatedTransaction.borrowerId],
                staff_creat: updatedTransaction.staff_creat
            };
            await Notify.create(notifyData);
        } else {
            // Nếu transactionStatus là false (đã trả sách), tạo thông báo cho việc đã trả sách
            const notifyData = {
                NotifyName: `${user.userFullName} đã trả sách`,
                description: `${user.userFullName} đã trả sách ${book.bookName}.`,
                NotifyStatus: 1,
                NotifyType: "return books",
                transactions: [updatedTransaction._id],
                books: [updatedTransaction.books],
                user: [updatedTransaction.borrowerId],
                staff_creat: updatedTransaction.staff_creat,
                staff_edit: updatedTransaction.staff_edit
            };
            await Notify.create(notifyData);
        }
        const result = {
            result: "success",
            message: "Book transaction updated successfully",
            data: updatedTransaction
        };
        console.log('TransactionUpdated', result);
        res.json(result);
    } catch (error) {
        console.error('Error updating book transaction:', error);
        const result = {
            result: "fail",
            message: "Could not update book transaction: " + error.message
        };
        res.json(result);
    }
    // }
    // else {
    //     return res.status(403).json("You dont have permission to delete a book!");
    // }
};

// Display a form to delete a book transaction
export const book_transaction_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book transaction delete GET');
};

// Delete a book transaction using the POST method
export const book_transaction_delete = async (req, res) => {
    console.log('book transaction delete controller [delete]');
    const transactionId = req.params.id;
    try {
        const deletedTransaction = await BookTransaction.deleteBookTransaction(transactionId);
        const result = {
            result: "success",
            message: "Book transaction deleted successfully",
            data: deletedTransaction
        };
        console.log('TransactionDeleted', result);
        res.json(result);
    } catch (error) {
        console.error('Error deleting book transaction:', error);
        const result = {
            result: "fail",
            message: "Could not delete book transaction: " + error.message
        };
        res.json(result);
    }
};
export const getBookTransactionCount = async (req, res) => {
    try {
        const count = await BookTransaction.count();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching book transaction count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
