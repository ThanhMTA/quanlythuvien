// // import express from "express"
// // import Book from "../models/Book.js"
// // import User from "../models/User.js";
// // import Transaction from "../models/BookTransaction.js";


// // const router = express.Router()

// // router.get("/bookusertrans", async (req, res) => {
// //     try {
// //         const bookCount = await Book.countDocuments();
// //         const userCount = await User.countDocuments();
// //         const transactionCount = await Transaction.countDocuments();
// //         console.log("thong ke ",bookCount, userCount,transactionCount)

// //         res.status(200).json({
// //             bookCount,
// //             userCount,
// //             transactionCount,
// //         });
// //     }
// //     catch (err) {
// //         return res.status(504).json(err);
// //     }
// // })

// // export default router;
// import express from 'express';
// import { getCounts } from '../Controller/statistics.js';

// const router = express.Router();
// router.get('/bookusertrans', getCounts);

// export default router;