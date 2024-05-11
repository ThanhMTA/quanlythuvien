import Dao from './Dao.js';
import Book, { updateBook } from '../models/Book.js';
import BookCategory from '../models/BookCategory.js';

class BookDao extends Dao {
    constructor() {
        super(Book);
    }

    // Tìm kiếm sách theo tên
    async getBooksByName(name) {
        try {
            const books = await this.model.find({ bookName: { $regex: name, $options: 'i' } });
            return books;
        } catch (error) {
            throw new Error("Could not find books by name: " + error.message);
        }
    }

    async addBook(bookData) {
        try {
            // Tạo sách mới và lưu vào cơ sở dữ liệu
            const newBook = await new Book({
                bookName: bookData.bookName,
                description: bookData.description,
                author: bookData.author,
                bookCountAvailable: bookData.bookCountAvailable,
                language: bookData.language,
                publisher: bookData.publisher,
                bookStatus: bookData.bookSatus,
                categories: bookData.categories,
                image_url: bookData.image_url,
                bookCount: bookData.bookCount,
                staff_creat:bookData.creat
            }).save();

            // Tìm hoặc tạo mới danh mục sách
            let category = await BookCategory.findOne({ categoryName: bookData.categories });
            if (!category) {
                category = await BookCategory.create({ categoryName: bookData.categories });
            }

            // Thêm ID của sách vào danh mục sách
            category.books.push(newBook._id);
            await category.save();

            return newBook;
        } catch (error) {
            throw new Error("Could not add book: " + error.message);
        }
    }

    // Cập nhật thông tin của một cuốn sách
    async updateBook(bookId, updatedData) {

        try {
            const {
                bookName,
                description,
                author,
                bookCountAvailable,
                language,
                publisher,
                bookStatus,
                categories,
                image_url,
                bookCount, 
                staff_edit
                // password
            } = updatedData;
            const updatedBook = await Book.findByIdAndUpdate(
                bookId,
                {
                    bookName,
                    description,
                    author,
                    bookCountAvailable,
                    language,
                    publisher,
                    bookStatus,
                    categories,
                    image_url,
                    bookCount,
                    staff_edit
                    // password
                },
                { new: true }
            );
            if (!updatedBook) {
                throw new Error('book not found');
            }

            return updatedBook;

        } catch (error) {
            throw new Error("Could not update book: " + error.message);
        }
    }

    // Xóa một cuốn sách
    async deleteBook(bookId) {
        try {
            const deletedBook = await this.delete(bookId);
            return deletedBook;
        } catch (error) {
            throw new Error("Could not delete book: " + error.message);
        }
    }

    // Lấy tất cả sách
    async getAllBooks() {
        try {
            const allBooks = await Book.find({}).select(' bookName description author bookCountAvailable language publisher bookStatus categories image_url bookCount');
            return allBooks;
        } catch (error) {
            throw new Error("Could not fetch all books: " + error.message);
        }
    }

    // Lấy thông tin của một cuốn sách dựa trên ID
    async getBookById(bookId) {
        try {
            // const book = await this.getById(bookId);

            const book = await Book.findById(bookId).select(' bookName description author bookCountAvailable language publisher bookStatus categories image_url bookCount');
            return book;
        } catch (error) {
            throw new Error("Could not find book by ID: " + error.message);
        }
    }
    async getAllCategories() {
        try {
            // Thực hiện truy vấn để lấy tất cả các categories duy nhất
            const categories = await Book.distinct('categories');
            return categories;
        } catch (error) {
            throw new Error("Could not fetch categories: " + error.message);
        }
    }

    async getBooksByCategory(cateName) {
        try {
            // Thực hiện truy vấn để tìm các sách có categories chứa cateName
            const books = await Book.find({ categories: cateName }).select('bookName description author bookCountAvailable language publisher bookStatus categories image_url bookCount');
            console.log("bok1", books)
            return books;

        } catch (error) {
            throw new Error("Could not find books by category: " + error.message);
        }
    }

    async countBooks() {
        try {
            const count = await this.model.count();
            return count;
        } catch (error) {
            throw new Error("Could not count books: " + error.message);
        }
    }
    //  thiếu lấy sách theo loại, tìm kiếm sách theo ký tự bất kì 




}



export default BookDao;
