import express from 'express';


const API_URL = 'http://localhost:5000/api/transactions';
const router = express.Router();


// // Filename: routes/bookTransaction.js
// import express from 'express';
// import {
//     book_transaction_list, book_transaction_create_post,
//     book_transaction_delete_get, book_transaction_delete, book_transaction_update_get,
//     book_transaction_update_put, book_transaction_detail, book_transaction_status_put, book_transaction_user
// } from '../Controller/BookTransaction.js';
// import BookTransaction from "../models/BookTransaction.js";

// const router = express.Router();

// /// BOOK TRANSACTION ROUTES ///

// /* GET request for list of all book transactions. */
// router.get('/all-transactions', book_transaction_list);
router.get('/all-transactions', async (req, res) => {
    try {
        const token = req.headers.authorization;
        console.log("token tesst transaction " + token)
        // Tạo các tùy chọn yêu cầu bao gồm tiêu đề Authorization với token
        const requestOptions = {
            headers: {
                Authorization: token
            }
        };

        const response = await fetch(`${API_URL}/all-transactions`,requestOptions);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// // lấy danh sách transaction theo người dùng 
// router.get('/user-transactions/:id', book_transaction_user);
router.get('/user-transactions/:id', async (req, res) => {
    try {
        const id = req.params.id; // Lấy cateName từ req.params
        const response = await fetch(`${API_URL}/user-transactions/${id}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// /* POST request for creating a book transaction. */
// router.post('/add-transaction', book_transaction_create_post);
router.post('/add-transaction', async (req, res) => {
    try {
        const bookData = req.body; // Lấy dữ liệu sách từ req.body

        const response = await fetch(`${API_URL}/add-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData) // Chuyển dữ liệu sách sang định dạng JSON và gửi đi
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// /* GET request to delete a book transaction. */
// // router.get('/book-transaction/:id/delete', book_transaction_delete_get);

// // POST request to delete a book transaction
// router.delete('/remove-transaction/:id', book_transaction_delete);

// /* GET request to update a book transaction. */
// router.get('/book-transaction/:id/update', book_transaction_update_get);

// // POST request to update a book transaction
// router.put('/update-transaction/:id', book_transaction_update_put);
router.put('/update-transaction/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedBookData = req.body; // Dữ liệu sách được cập nhật từ req.body

        const response = await fetch(`${API_URL}/update-transaction/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBookData) // Chuyển dữ liệu sách cập nhật sang định dạng JSON và gửi đi
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// //  update transaction status 
// router.put('/update-transactionStatus/:id', book_transaction_status_put);
router.put('/update-transactionStatus/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedBookData = req.body; // Dữ liệu sách được cập nhật từ req.body

        const response = await fetch(`${API_URL}/update-transactionStatus/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBookData) // Chuyển dữ liệu sách cập nhật sang định dạng JSON và gửi đi
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// /* GET request for one book transaction. */
// router.get('/get-transaction/:id', book_transaction_detail);
// router.delete('/delete-all', async (req, res) => {
//     try {
//         // Xóa tất cả các giao dịch từ cơ sở dữ liệu
//         await BookTransaction.deleteMany({});

//         // Trả về phản hồi thành công
//         return res.status(200).json({ success: true, message: 'All transactions have been deleted.' });
//     } catch (error) {
//         // Nếu có lỗi, trả về phản hồi lỗi
//         console.error('Error:', error);
//         return res.status(500).json({ success: false, message: 'An error occurred while deleting transactions.' });
//     }
// });

export default router;
