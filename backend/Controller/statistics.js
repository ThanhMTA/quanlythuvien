import BookService from '../Service/BookService.js';
import BookTransactionService from '../Service/BookTransactionService.js';
import UserService from '../Service/UserService.js';
const BookS = new BookService();
const BookTransaction = new BookTransactionService();
const User = new UserService();

export const getCounts = async (req, res) => {
    try {
        const bookCount = await Book.countBooks();
        const bookTransactionCount = await BookTransaction.countBookTransaction();
        const userCount = await User.countUser();


        res.json({ bookCount, bookTransactionCount, userCount });
    } catch (error) {
        console.error('Error fetching book and transaction counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
