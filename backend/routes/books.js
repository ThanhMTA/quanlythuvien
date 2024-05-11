// import express from "express"
// import Book from "../models/Book.js"
// import BookCategory from "../models/BookCategory.js"

// const router = express.Router()

// /* Get all books in the db */
// router.get("/allbooks", async (req, res) => {
//     try {
//         console.log("co em get all books");
//         const books = await Book.find({}).populate("transactions").sort({ _id: -1 })
//         res.status(200).json(books)
//     }
//     catch (err) {
//         return res.status(504).json(err);
//     }
// })
// router.get("/allbook", async (req, res) => {

// })



// router.get("/get20book", async (req, res) => {
//     try {
//         console.log("co em get all books");
//         const books = await Book.find({}).populate("transactions").sort({ _id: -1 }).limit(20)
//         res.status(200).json(books)
//     }
//     catch (err) {
//         return res.status(504).json(err);
//     }
// })



// /* Get Book by book Id */
// router.get("/getbook/:id", async (req, res) => {
//     try {
//         console.log("lay mot dau sach", req.params.id);
//         const book = await Book.findById(req.params.id).populate("transactions")
//         res.status(200).json(book)
//     }
//     catch {
//         return res.status(500).json(err)
//     }
// })


// /* Get Book by category name */
// router.get("/getallcate", async (req, res) => {
//     try {
//         console.log("herre")
//         const categories = await Book.distinct("categories");
//         res.status(200).json(categories)
//     }
//     catch (err){
//         return res.status(500).json(err)
//     }
// })


// /* Get Book by category name */
// router.get("/getbycate/:cateName", async (req, res) => {
//     try {
//         console.log("lay theo the loai", req.params.cateName);
//         const book = await Book.find({ categories: req.params.cateName });
//         res.status(200).json(book)
//     }
//     catch (err){
//         return res.status(500).json(err)
//     }
// })
// /* Search Book by keyword */

// router.get("/search/:keyword", async (req, res) => {
//     try {
//         const searchTerm  = req.params.keyword;
//         console.log("tim kiem ", req.params.keyword)

//         // Tìm kiếm các cuốn sách với tên chứa từ khóa tìm kiếm
//         const books = await Book.find({
//             bookName: { $regex: req.params.keyword, $options: "i" },
//         });
//         res.status(200).json(books);
//     }
//     catch (err){
//         return res.status(500).json(err)
//     }
// })


// /* Adding book */
// router.post("/addbook", async (req, res) => {
//     if (req.body.isAdmin) {
//         try {
//             const newbook = await new Book({
//                 bookName: req.body.bookName,
//                 description: req.body.description,
//                 author: req.body.author,
//                 bookCountAvailable: req.body.bookCountAvailable,
//                 language: req.body.language,
//                 publisher: req.body.publisher,
//                 bookStatus: req.body.bookSatus,
//                 categories: req.body.categories,
//                 image_url: req.body.image_url,
//             })
//             console.log("add 1 cuon sach => ", newbook)
//             const book = await newbook.save()
//             // await BookCategory.updateMany({ '_id': book.categories }, { $push: { books: book._id } });
//             res.status(200).json(book)
//         }
//         catch (err) {
//             res.status(504).json(err)
//             console.log(err);
//         }
//     }
//     else {
//         return res.status(403).json("You dont have permission to add a book!");
//     }
// })

// /* Addding book */
// router.put("/updatebook/:id", async (req, res) => {
//     if (req.body.isAdmin) {
//         try {
//             await Book.findByIdAndUpdate(req.params.id, {
//                 $set: req.body,
//             });
//             res.status(200).json("Book details updated successfully");
//         }
//         catch (err) {
//             res.status(504).json(err);
//         }
//     }
//     else {
//         return res.status(403).json("You dont have permission to delete a book!");
//     }
// })

// /* Remove book  */
// router.delete("/removebook/:id", async (req, res) => {
//     try {
//         const _id = req.params.id
//         const book = await Book.findOneAndDelete(req.params.id);
//         console.log("Xoa",book)
//         // await book.remove()
//         // await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
//         res.status(200).json("Book has been deleted");
//     } catch (err) {
//         return res.status(504).json(err);
//     }

// })

// export default router


import express from 'express';
import {
    book_list, book_create_post,
    book_delete_get, book_delete, book_update_get,
    book_update_put, book_detail, getBookCount, book_search, categories_list, categories_list_book
} from '../Controller/Book.js';
import Book, { updateBook } from '../models/Book.js';
// import { verifyToken } from './token.js';
import verifyToken from './token.js';
const router = express.Router();
import multer from 'multer';
import path from 'path';
import authJwt from "../middleware/authJwt.js";

/// BOOK ROUTES ///

/* GET book home page. will get all book list */

/* GET request for creating a Book. NOTE This must come before routes that display Book (uses id) */
// router.get('/book/create', book_create_get);

/* POST request for creating Book. */
router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
router.post('/addbook', book_create_post);
// Backend



/* GET request to delete Book. */
router.get('/removebook/:id', book_delete_get);

// POST request to delete Book
router.delete('/removebook/:id', book_delete);

/* GET request to update Book. */
router.get('/updatebook/:id', book_update_get);

// POST request to update Book
router.put('/updatebook/:id', book_update_put);

/* GET request for one Book. */
router.get('/getbook/:id', book_detail);

/* GET request for list of all Book items. */
router.get('/allbooks',[authJwt.verifyToken],book_list);
router.get('/getallcates', categories_list);
router.get('/getbycate/:cateName', categories_list_book);


router.get('/search/:key', book_search);

/* lấy số lượng sách*/
router.get('/count', getBookCount);

router.post('/updateCountBook', async (req, res) => {
    try {
        // Lấy tất cả sách từ cơ sở dữ liệu
        const allBooks = await Book.find();

        // Duyệt từng cuốn sách và cập nhật
        const updatedBooks = await Promise.all(allBooks.map(async (book) => {
            try {
                const updatedBook = await Book.findByIdAndUpdate(
                    book._id,
                    { bookCount: book.bookCountAvailable },
                    { new: true }
                );
                if (!updatedBook) {
                    throw new Error('Could not update book: ' + book._id);
                }
                return updatedBook;
            } catch (error) {
                console.error("Error updating book:", error.message);
                throw error; // Ném lỗi để Promise.all có thể bắt và xử lý
            }
        }));

        res.json(updatedBooks); // Trả về kết quả cập nhật
    } catch (error) {
        console.error("Error updating books:", error.message);
        res.status(500).json({ error: "Could not update books" });
    }
});


export default router;
