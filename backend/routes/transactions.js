// import express from "express"
// import Book from "../models/Book.js"
// import BookTransaction from "../models/BookTransaction.js"
// import router from "./books.js"



// router.post("/add-transaction", async (req, res) => {
//     try{

//         if(req.body.isAdmin === true){
//             console.log("co giao dich!!")
//             const newtran = await new BookTransaction({
//                 bookId: req.body.bookId,
//                 borrowerId: req.body.borrowerId,
//                 bookName: req.body.bookName,
//                 borrowerName: req.body.borrowerName,
//                 transactionType: req.body.transactionType,
//                 fromDate: req.body.fromDate,
//                 toDate: req.body.toDate
//             })
//             console.log(newtran);
//             const transaction = await newtran.save();

//             res.status(200).json(transaction);

//         }else{

//             res.status(500).json("You aren't allowed to add a Transaction");

//         }
//     }catch(err){
//         res.status(504).json(err);

//     }
// })


// router.get("/all-transactions", async (req,res) => {
//     try {
//         const transactions = await BookTransaction.find({}).populate("borrowerId").sort({_id:-1});
//         res.status(200).json(transactions);
//     }catch (err){
//         return res.status(500).json(err);
//     }
// })


// router.put("/update-transaction/:id", async (req, res) => {
//     try {
//         if (req.body.isAdmin) {
//             await BookTransaction.findByIdAndUpdate(req.params.id, {
//                 $set: req.body,
//             });
//             res.status(200).json("Transaction details updated successfully");
//         }
//     }
//     catch (err) {
//         res.status(504).json(err)
//     }
// })

// router.delete("/remove-transaction/:id", async (req, res) => {
//     if (req.body.isAdmin) {
//         try {
//             const data = await BookTransaction.findByIdAndDelete(req.params.id);
//             const book = Book.findById(data.bookId)
//             console.log(book)
//             await book.updateOne({ $pull: { transactions: req.params.id } })
//             res.status(200).json("Transaction deleted successfully");
//         } catch (err) {
//             return res.status(504).json(err);
//         }
//     } else {
//         return res.status(403).json("You dont have permission to delete a book!");
//     }
// })

// export default router;
// Filename: routes/bookTransaction.js
import express from 'express';
import {
    book_transaction_list, book_transaction_create_post,
    book_transaction_delete_get, book_transaction_delete, book_transaction_update_get,
    book_transaction_update_put, book_transaction_detail, book_transaction_status_put, book_transaction_user
} from '../Controller/BookTransaction.js';
import BookTransaction from "../models/BookTransaction.js";
import Notify from '../models/notify.js';
import authJwt from "../middleware/authJwt.js";

const router = express.Router();

/// BOOK TRANSACTION ROUTES ///
router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
/* GET request for list of all book transactions. */
router.get('/all-transactions', [authJwt.verifyToken], book_transaction_list);
// lấy danh sách transaction theo người dùng 
router.get('/user-transactions/:id', book_transaction_user);
/* POST request for creating a book transaction. */
router.post('/add-transaction', book_transaction_create_post);

/* GET request to delete a book transaction. */
// router.get('/book-transaction/:id/delete', book_transaction_delete_get);

// POST request to delete a book transaction
router.delete('/remove-transaction/:id', book_transaction_delete);

/* GET request to update a book transaction. */
router.get('/book-transaction/:id/update', book_transaction_update_get);

// POST request to update a book transaction
router.put('/update-transaction/:id', book_transaction_update_put);
//  update transaction status 
router.put('/update-transactionStatus/:id', book_transaction_status_put);


/* GET request for one book transaction. */
router.get('/get-transaction/:id', book_transaction_detail);
router.delete('/delete-all', async (req, res) => {
    try {
        // Xóa tất cả các giao dịch từ cơ sở dữ liệu
        await BookTransaction.deleteMany({});

        // Trả về phản hồi thành công
        return res.status(200).json({ success: true, message: 'All transactions have been deleted.' });
    } catch (error) {
        // Nếu có lỗi, trả về phản hồi lỗi
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while deleting transactions.' });
    }
});

export default router;
