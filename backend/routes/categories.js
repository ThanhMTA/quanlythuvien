// import express from "express";

import BookCategory from "../models/BookCategory.js"
import express from 'express';
import {
    category_list, category_create_post,
    category_delete_get, category_delete, category_update_get,
    category_update_put, category_detail
} from '../Controller/BookCategory.js';
import authJwt from "../middleware/authJwt.js";

const router = express.Router();

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

/* GET request for list of all book categories. */
router.get('/allcategories', category_list);

/* POST request for creating a book category. */
router.post('/addcategory', category_create_post);

// /* GET request to delete a book category. */
// router.get('/category/:id/delete', category_delete_get);

// // POST request to delete a book category
router.post('/delete/:id', category_delete);

// /* GET request to update a book category. */
// router.get('/category/:id/update', category_update_get);

// // POST request to update a book category
// router.post('/category/:id/update', category_update_post);

// /* GET request for one book category. */
// router.get('/getcategory/:id', category_detail);
router.delete('/delete-all', async (req, res) => {
    try {
        // Xóa tất cả các giao dịch từ cơ sở dữ liệu
        await BookCategory.deleteMany({});

        // Trả về phản hồi thành công
        return res.status(200).json({ success: true, message: 'All transactions have been deleted.' });
    } catch (error) {
        // Nếu có lỗi, trả về phản hồi lỗi
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while deleting transactions.' });
    }
});

export default router;
