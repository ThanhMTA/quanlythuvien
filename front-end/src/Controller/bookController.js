import TransApi from "../callAPI/trans.js"
import BookApi from "../callAPI/BookApi.js";
import UserApi from "../callAPI/user.js";
const BookController = {
    getAllBooks: async () => {
        try {
            const allBooks = await BookApi.GetAllBooks();
            console.log("Book", allBooks)
            // Xử lý dữ liệu nếu cần
            return allBooks;
        } catch (error) {
            // Xử lý lỗi nếu cần
            console.error("Error in getting all books:", error);
            throw error;
        }
    },
    getAllCate: async () => {
        try {
            const allBooks = await BookApi.getAllCate();
            console.log("Book", allBooks)
            // Xử lý dữ liệu nếu cần
            return allBooks;
        } catch (error) {
            // Xử lý lỗi nếu cần
            console.error("Error in getting all books:", error);
            throw error;
        }
    },
    // Các hàm controller khác có thể được thêm ở đây
    addBook: async (bookData) => {
        try {
            const addedBook = await BookApi.addBook(bookData);
            return addedBook;
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    },
    updateBook: async (bookId, data) => {
        try {
            const updatedbook = await BookApi.updateBook(bookId, data);
            return updatedbook;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    },
    deleteBook: async (bookId) => {
        try {
            const updatedbook = await BookApi.deleteBook(bookId);
            return updatedbook;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }
};
export default BookController;
