
import BookBusiness from '../Business/BookBusiness.js';

class BookService {
    constructor() {
        this.BookBusiness = new BookBusiness();
    }

    // Tìm kiếm sách theo tên
    async getBooksByName(name) {
        try {
            const books = await this.BookBusiness.getBooksByName({ bookName: { $regex: name, $options: 'i' } });
            return books;
        } catch (error) {
            throw new Error("Could not find books by name: " + error.message);
        }
    }

    // Thêm một cuốn sách mới
    async addBook(bookData) {
        try {
            const newBook = await this.BookBusiness.addBook(bookData);
            return newBook;
        } catch (error) {
            throw new Error("Could not add book: " + error.message);
        }
    }

    // Cập nhật thông tin của một cuốn sách
    async updateBook(bookId, updatedData) {
        try {
            const updatedBook = await this.BookBusiness.updateBook(bookId, updatedData);
            return updatedBook;
        } catch (error) {
            throw new Error("Could not update book: " + error.message);
        }
    }

    // Xóa một cuốn sách
    async deleteBook(bookId) {
        try {
            const deletedBook = await this.BookBusiness.deleteBook(bookId);
            return deletedBook;
        } catch (error) {
            throw new Error("Could not delete book: " + error.message);
        }
    }

    // Lấy tất cả sách
    async getAllBooks() {
        try {
            const allBooks = await this.BookBusiness.getAllBooks();
            return allBooks;
        } catch (error) {
            throw new Error("Could not fetch all books: " + error.message);
        }
    }

    // Lấy thông tin của một cuốn sách dựa trên ID
    async getBookById(bookId) {
        try {
            const book = await this.BookBusiness.getBookById(bookId);
            return book;
        } catch (error) {
            throw new Error("Could not find book by ID: " + error.message);
        }
    }
    async getAllCategories() {
        try {
            // Thực hiện truy vấn để lấy tất cả các categories duy nhất
            const categories = await this.BookBusiness.getAllCategories();
            return categories;
        } catch (error) {
            throw new Error("Could not fetch categories: " + error.message);
        }
    }

    async getBooksByCategory(cateName) {
        try {
            // Thực hiện truy vấn để tìm các sách có categories chứa cateName
            const books = await this.BookBusiness.getBooksByCategory(cateName)
              
            return books;
        } catch (error) {
            throw new Error("Could not find books by category: " + error.message);
        }
    }
    async countBooks() {
        try {
            const count = await this.BookBusiness.countBooks();
            return count;
        } catch (error) {
            throw new Error("Could not count books: " + error.message);
        }
    }
    async updateCountBook() {
        try {
            // Kết nối tới cơ sở dữ liệu MongoDB


            // Cập nhật trường countbook bằng giá trị của trường bookCountAvailable
            const result = await this.BookBusiness.updateCountBook();

            console.log("Cập nhật countbook thành công:", result);
        } catch (error) {
            console.error("Lỗi khi cập nhật countbook:", error);
        }
    }
}


export default BookService;
