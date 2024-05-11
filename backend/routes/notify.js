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
router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
router.get("/all-notify", [authJwt.verifyToken], async (req, res) => {
    try {

        const notifies = await Notify.find(); // Lấy tất cả các thông báo từ cơ sở dữ liệu
        res.json(notifies); // Trả về thông báo trong phản hồi dưới dạng JSON
    } catch (error) {
        console.error('Error fetching notifies:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Trả về lỗi nếu có lỗi xảy ra
    }
});
router.get("/user-notify/:userId", [authJwt.verifyToken], async (req, res) => {
    try {
        const userId = req.params.userId; // Lấy userId từ request parameters
        const notifies = await Notify.find({ user: userId }); // Lấy tất cả các thông báo có user là userId
        res.json(notifies); // Trả về thông báo trong phản hồi dưới dạng JSON
    } catch (error) {
        console.error('Error fetching notifies:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Trả về lỗi nếu có lỗi xảy ra
    }
});
router.get("/staff-notify/:staff_creat", [authJwt.verifyToken], async (req, res) => {
    try {
        const staff_creat = req.params.staff_creat; // Lấy staff_creat từ request parameters
        const notifies = await Notify.find({
            $or: [
                { staff_creat: staff_creat }, // Lấy thông báo có staff_creat truyền vào
                { staff_edit: staff_creat },
                { staff_creat: { $exists: false } } // Lấy thông báo có staff_creat rỗng
            ]
        })
            .sort({ createdAt: -1 });
        res.json(notifies); // Trả về thông báo trong phản hồi dưới dạng JSON
    } catch (error) {
        console.error('Error fetching notifies:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Trả về lỗi nếu có lỗi xảy ra
    }
});

router.get("/countUesr/:userId", [authJwt.verifyToken], async (req, res) => {
    try {
        const userId = req.params.userId; // Lấy userId từ request parameters
        const count = await Notify.countDocuments({ NotifyStatus: 1, user: userId }); // Lấy số lượng thông báo có NotifyStatus bằng 1 và user là userId
        res.json(count); // Trả về số lượng thông báo trong phản hồi dưới dạng JSON
    } catch (error) {
        console.error('Error fetching notifies:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Trả về lỗi nếu có lỗi xảy ra
    }
});
router.get("/countSaft/:userId", [authJwt.verifyToken], async (req, res) => {
    try {
        const staff_creat = req.params.userId; // Lấy userId từ request parameters

        const count = await Notify.countDocuments({
            NotifyStatus: 1,

            $or: [
                { staff_creat: staff_creat }, // Lấy thông báo có staff_creat truyền vào
                { staff_edit: staff_creat },
                { staff_creat: { $exists: false } } // Lấy thông báo có staff_creat rỗng
            ] // Lấy thông báo có staff_creat truyền vào

        }); // Lấy số lượng thông báo có NotifyStatus bằng 1 và user là userId
        res.json(count); // Trả về số lượng thông báo trong phản hồi dưới dạng JSON
        console.log("so thong bao", count)
        console.log("id=> creat ", staff_creat)
    } catch (error) {
        console.error('Error fetching notifies:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Trả về lỗi nếu có lỗi xảy ra
    }
});

router.post("/notify", [authJwt.verifyToken], async (req, res) => {
    try {
        const { NotifyName, description, NotifyStatus, transactions, books } = req.body; // Lấy dữ liệu từ yêu cầu POST
        const newNotify = new Notify({ // Tạo một đối tượng thông báo mới
            NotifyName,
            description,
            NotifyStatus,
            transactions,
            books
        });
        const savedNotify = await newNotify.save(); // Lưu thông báo mới vào cơ sở dữ liệu
        res.status(201).json(savedNotify); // Trả về thông báo mới đã tạo trong phản hồi dưới dạng JSON
    } catch (error) {
        console.error('Error creating notify:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Trả về lỗi nếu có lỗi xảy ra
    }
});
router.put("/update/:id", [authJwt.verifyToken], async (req, res) => {
    try {
        console.log('update');

        const notifyId = req.params.id; // Lấy ID thông báo từ request parameters

        // Tìm thông báo theo ID và cập nhật trạng thái thành 0
        const updatedNotify = await Notify.findByIdAndUpdate(notifyId, { NotifyStatus: 0 });

        if (!updatedNotify) {
            // Nếu không tìm thấy thông báo với ID đã cung cấp
            return res.status(404).json({ error: 'Notify not found' });
        }


        res.json(updatedNotify); // Trả về thông báo đã được cập nhật trong phản hồi dưới dạng JSON
    } catch (error) {
        console.error('Error updating notify:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Trả về lỗi nếu có lỗi xảy ra
    }
});

export default router;