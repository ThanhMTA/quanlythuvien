// Filename: controllers/book.js
import BookService from '../Service/BookService.js';
import { Client as MinioClient } from 'minio';
import fs from 'fs';
import User from '../models/User.js';
import Notify from '../models/notify.js';
import multer from 'multer';
import path from 'path';
// Tạo một đối tượng BookService để thực hiện các thao tác với model Book
const Book = new BookService();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const minioClient = new MinioClient({
    endPoint: 'localhost',
    port: 9000,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
    useSSL: true,
    caPath: 'E:/setup/minio/certs/public.crt', // Path to CA certificate file
});
// upload ảnh lên minio 

// Hiển thị danh sách tất cả các sách
export const book_list = async (req, res) => {
    console.log('user list controller');
    try {
        const books = await Book.getAllBooks();
        if (books.length === 0) {
            res.send('NO USERS FOUND: No users found in database');
        } else {
            for (let i = 0; i < books.length; i++) {
                const imageUrl = `http://localhost:5000/api/minio/images/${books[i].image_url}`;
                books[i].image_url = imageUrl;
            }
            res.json(books);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};
export const categories_list = async (req, res) => {
    console.log('book list controller');
    try {
        const books = await Book.getAllCategories();
        if (books.length === 0) {
            res.send('NO BOOKS FOUND: No books found in database');
        } else {
            res.json(books);
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
};
export const categories_list_book = async (req, res) => {
    const category = req.params.cateName;
    console.log('book list controller');
    try {
        const books = await Book.getBooksByCategory(category);
        if (books.length === 0) {
            res.send('NO BOOKS FOUND: No books found in database');
        } else {
            // Lặp qua từng cuốn sách để thêm URL hình ảnh từ Minio
            for (let i = 0; i < books.length; i++) {
                const imageUrl = `http://localhost:5000/api/minio/images/${books[i].image_url}`;
                books[i].image_url = imageUrl;
            }

            res.json(books);
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Hiển thị chi tiết của một cuốn sách cụ thể


export const book_detail = async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await Book.getBookById(bookId);
        if (!book) {
            res.send('BOOK NOT FOUND: Book not found in database');
        } else {
            // Lấy hình ảnh từ Minio
            // Giả sử imageName là một thuộc tính của book chứa tên của hình ảnh
            // Cập nhật URL hình ảnh của cuốn sách
            const imageUrl = `http://localhost:5000/api/minio/images/${book.image_url}`;
            book.image_url = imageUrl;

            // Trả về thông tin của cuốn sách kèm hình ảnh
            res.json(book);
        }
    } catch (error) {
        console.error('Error fetching book by ID:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Hiển thị form tạo sách
export const book_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book create GET');
};
// tạo sach 
async function uploadFileToMinio(bucketName, filePath, fileName) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const fileSize = fs.statSync(filePath).size;

        minioClient.putObject(bucketName, fileName, fileStream, fileSize, (err, etag) => {
            if (err) {
                console.error('Error occurred while uploading file to Minio:', err);
                reject(err);
            } else {
                console.log('File uploaded successfully to Minio.');
                resolve();
            }
        });
    });
}

// Tạo sách bằng phương thức POST
// export const book_create_post = async (req, res) => {
//     // if (req.body.isAdmin) {
//     console.log('book create controller post');
//     const bookData = req.body;
//     uploadFileToMinio('bucketbook', bookData.image_url, bookData._id + ".jpg")
//     bookData.image_url = bookData._id + ".jpg"
//     console.log(bookData);
//     try {
//         const newBook = await Book.addBook(bookData);
//         const result = {
//             result: "success",
//             message: "Book inserted successfully",
//             data: newBook
//         };
//         res.json(result);
//     } catch (error) {
//         console.error('Error adding book:', error);
//         const result = {
//             result: "fail",
//             message: "Could not add book: " + error.message
//         };
//         res.json(result);
//     }
//     // } else {
//     //     return res.status(403).json("You dont have permission to get transaction!");
//     // }
// };
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Thư mục lưu trữ hình ảnh
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Đổi tên file
    }
});

const upload = multer({ storage: storage });
export const book_create_post = async (req, res) => {
    try {
        // res.json(req);
        upload.single('image')(req, res, async function (err) {
            if (err) {
                // Handle Multer error here
                console.error('Error uploading file:', err);
                throw new Error('Error uploading file: ' + err.message);
            }
            // Lưu ảnh tạm thời ở backend
            const imagePath = req.file.path;
            console.log('book create controller post', req.file);
            const bookData = req.body;
            // uploadFileToMinio('bucketbook', imagePath, bookData._id + ".jpg")
            // bookData.image_url = bookData._id + ".jpg"
            console.log(bookData);
            try {
                const newBook = await Book.addBook(bookData);
                const result = {
                    result: "success",
                    message: "Book inserted successfully",
                    data: newBook
                };
                res.json(result);
                console.log("book", newBook)
                const newBookId = newBook._id;
                uploadFileToMinio('bucketbook', imagePath, newBookId + ".jpg")

                // await fs.promises.unlink(imagePath);
            } catch (error) {
                console.error('Error adding book:', error);
                const result = {
                    result: "fail",
                    message: "Could not add book: " + error.message
                };
                res.json(result);
            }
        });

    } catch (error) {
        console.error('Error adding book:', error);
        const result = {
            result: "fail",
            message: "Could not add book: " + error.message
        };
        res.json(result);
    }
};

// Hiển thị form cập nhật sách
export const book_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book update GET');
};
// update hình ảnh trên minio 
async function updateFileOnMinio(bucketName, filePath, fileName) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const fileSize = fs.statSync(filePath).size;

        // Kiểm tra xem file có tồn tại trên Minio hay không
        minioClient.statObject(bucketName, fileName, (err, stat) => {
            if (err) {

                console.log('File does not exist on Minio. Adding a new file.');
                minioClient.putObject(bucketName, fileName, fileStream, fileSize, (err, etag) => {
                    if (err) {
                        console.error('Error occurred while updating file on Minio:', err);
                        reject(err);
                    } else {
                        console.log('File updated successfully on Minio.');
                        resolve();
                    }
                });
            } else {
                // Nếu file tồn tại, thực hiện cập nhật
                minioClient.putObject(bucketName, fileName, fileStream, fileSize, (err, etag) => {
                    if (err) {
                        console.error('Error occurred while updating file on Minio:', err);
                        reject(err);
                    } else {
                        console.log('File updated successfully on Minio.');
                        resolve();
                    }
                });
            }
        });

    });
}

// Cập nhật sách bằng phương thức PUT
export const book_update_put = async (req, res) => {
    // if (req.body.isAdmin) {
    try {
        // res.json(req);
        upload.single('image')(req, res, async function (err) {
            if (err) {
                // Handle Multer error here
                console.error('Error uploading file:', err);
                throw new Error('Error uploading file: ' + err.message);
            }
            // Lưu ảnh tạm thời ở backend
            const imagePath = req.file.path;
            console.log('book file', imagePath);
            console.log('book update controller [put]');
            const bookId = req.params.id;
            updateFileOnMinio('bucketbook', imagePath, bookId + ".jpg")
            const updatedData = req.body;
            updatedData.image_url = bookId + ".jpg"
            console.log(updatedData);
            try {
                const updatedBook = await Book.updateBook(bookId, updatedData);
                const result = {
                    result: "success",
                    message: "Book updated successfully",
                    data: updatedBook
                };
                const userId = updatedBook.staff_edit;
                console.log("id", updatedBook)
                // Lấy danh sách các _id sách từ transaction
                const user = await User.findOne({ _id: { $in: userId } });
                console.log(user)
                const notifyData = {
                    NotifyName: ` ${updatedBook.bookName} vừa được cập nhật`,
                    description: ` cuốn sách ${updatedBook.bookName} được cập nhật bởi ${userFullName}`,
                    NotifyStatus: 1,
                    NotifyType: "update books",
                    // transactions: [updatedTransaction._id],
                    books: [updatedBook._id],
                    // user: [updatedTransaction.borrowerId],
                    staff_creat: updatedBook.staff_creat,
                    staff_edit: updatedBook.staff_edit

                };
                await Notify.create(notifyData);
                console.log('BookUpdated', result);
                // global.io.emit('BookUpdated', result);
                res.json(result);
            } catch (error) {
                console.error('Error updating book:', error);
                const result = {
                    result: "fail",
                    message: "Could not update book: " + error.message
                };
                res.json(result);
            }
        });
    } catch (error) {
        console.error('Error adding book:', error);
        const result = {
            result: "fail",
            message: "Could not add book: " + error.message
        };
        res.json(result);
    }

    // }
    // else {
    //     return res.status(403).json("You dont have permission to get transaction!");
    // }
};

// Hiển thị form xóa sách
export const book_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Xóa sách bằng phương thức POST
export const book_delete = async (req, res) => {
    // if (req.body.isAdmin) {
    console.log('category delete controller [delete]');
    const categoryId = req.params.id;
    try {
        const deletedCategory = await Book.deleteBook(categoryId);
        const result = {
            result: "success",
            message: "Category deleted successfully",
            data: deletedCategory
        };
        console.log('CategoryDeleted', result);
        res.json(result);
        // const userId = updatedBook.staff_edit;
        // console.log("id", updatedBook)
        // Lấy danh sách các _id sách từ transaction
        // const user = await User.findOne({ _id: { $in: userId } });
        // console.log(user)
        const notifyData = {
            NotifyName: ` xóa sách vừa được cập nhật`,
            description: `xóa sách`,
            NotifyStatus: 1,
            NotifyType: "update books",
            // transactions: [updatedTransaction._id],
            // books: [updatedBook._id],
            // user: [updatedTransaction.borrowerId],
            // staff_creat: updatedBook.staff_creat,
            // staff_edit: updatedBook.staff_edit

        };
        await Notify.create(notifyData);
        console.log('BookUpdated', result);
        // global.io.emit('BookUpdated', result);
        res.json(result);
    } catch (error) {
        console.error('Error deleting category:', error);
        const result = {
            result: "fail",
            message: "Could not delete category: " + error.message
        };
        res.json(result);
    }
    // }
    // else {
    //     return res.status(403).json("You dont have permission to get transaction!");
    // }
};

// Hàm để lấy số lượng sách
export const getBookCount = async (req, res) => {
    try {
        const count = await Book.countBooks();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching book count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const book_search = async (req, res) => {
    console.log('Book search controller');
    const keyword = req.query.keyword; // Extract keyword from query parameters
    try {
        let books;
        if (keyword) {
            // If a keyword is provided, search for books containing that keyword
            books = await Book.getBooksByName(keyword);
        } else {
            // If no keyword is provided, return all books
            books = await Book.getAllBooks();
        }
        if (books.length === 0) {
            res.send('NO BOOKS FOUND: No books found in database');
        } else {
            res.json(books);
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
};
