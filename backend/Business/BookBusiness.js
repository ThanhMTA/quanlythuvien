
import BookDao from '../Dao/BookDao.js';

class BookBusiness {
    constructor() {
        this.bookDao = new BookDao();
    }

    // Tìm kiếm sách theo tên
    async getBooksByName(name) {
        try {
            const books = await this.bookDao.getBooksByName({ bookName: { $regex: name, $options: 'i' } });
            return books;
        } catch (error) {
            throw new Error("Could not find books by name: " + error.message);
        }
    }

    // Thêm một cuốn sách mới
    async addBook(bookData) {
        try {
            const newBook = await this.bookDao.addBook(bookData);
            return newBook;
        } catch (error) {
            throw new Error("Could not add book: " + error.message);
        }
    }

    // Cập nhật thông tin của một cuốn sách
    async updateBook(bookId, updatedData) {
        try {
            const updatedBook = await this.bookDao.updateBook(bookId, updatedData);
            return updatedBook;
        } catch (error) {
            throw new Error("Could not update book: " + error.message);
        }
    }

    // Xóa một cuốn sách
    async deleteBook(bookId) {
        try {
            const deletedBook = await this.bookDao.deleteBook(bookId);
            return deletedBook;
        } catch (error) {
            throw new Error("Could not delete book: " + error.message);
        }
    }

    // Lấy tất cả sách
    async getAllBooks() {
        try {
            const allBooks = await this.bookDao.getAllBooks();
            return allBooks;
        } catch (error) {
            throw new Error("Could not fetch all books: " + error.message);
        }
    }

    // Lấy thông tin của một cuốn sách dựa trên ID
    async getBookById(bookId) {
        try {
            const book = await this.bookDao.getBookById(bookId);
            return book;
        } catch (error) {
            throw new Error("Could not find book by ID: " + error.message);
        }
    }
    async getAllCategories() {
        try {
            // Thực hiện truy vấn để lấy tất cả các categories duy nhất
            const categories = await this.bookDao.getAllCategories();
            return categories;
        } catch (error) {
            throw new Error("Could not fetch categories: " + error.message);
        }
    }

    async getBooksByCategory(cateName) {
        try {
            // Thực hiện truy vấn để tìm các sách có categories chứa cateName
            const books = await this.bookDao.getBooksByCategory(cateName)
             
            return books;
        } catch (error) {
            throw new Error("Could not find books by category: " + error.message);
        }
    }
    async countBooks() {
        try {
            const count = await this.bookDao.countBooks();
            return count;
        } catch (error) {
            throw new Error("Could not count books: " + error.message);
        }
    }
    async updateCountBook() {
        try {
            // Kết nối tới cơ sở dữ liệu MongoDB


            // Cập nhật trường countbook bằng giá trị của trường bookCountAvailable
            const result = await this.bookDao.updateCountBook();

            console.log("Cập nhật countbook thành công:", result);
        } catch (error) {
            console.error("Lỗi khi cập nhật countbook:", error);
        }
    }
}


export default BookBusiness;
