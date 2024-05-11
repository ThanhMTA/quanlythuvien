import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import http from 'http';
import Notify from "./models/notify.js";
import BookTransaction from "./models/BookTransaction.js";
import Book from "./models/Book.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import bookRoutes from "./routes/books.js";
import transactionRoutes from "./routes/transactions.js";
import categoryRoutes from "./routes/categories.js";
import statisticsRoutes from "./routes/statistics.js";
import minio from "./routes/minio.js"
import notify from "./routes/notify.js"
// import socket from "./routes/socket.js"
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from 'passport';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

app.use(passport.initialize());
import passportConfig from './passport-config.js';
passportConfig(passport);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});
app.use(cors());
io.on('connection', (socket) => {
  console.log('Client connected ');

  socket.on('notifyChange', () => {
    // Emit notification to all connected clients
    io.emit('dataChanged');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
server.listen(8888, () => {
  console.log('Server is running on port 4000');
});

/* Middlewares */
app.use(express.json());
app.use(cors());

/* API Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/minio", minio);
app.use("/api/notify", notify);
// app.use("/api/socket", socket);

/* MongoDB connection */
mongoose.connect(
  process.env.MONGO_URL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("MONGODB CONNECTED");
  }
);

/* Schedule task to check and create overdue notifications */
// Lập lịch tự động tạo notify vào 23:32 hàng ngày
cron.schedule('34 21 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('today:', today);
    // Tính toán ngày 19 ngày trước đây
    const nineteenDaysAgo = new Date(today);
    nineteenDaysAgo.setDate(today.getDate() - 20);
    console.log('nineteenDaysAgo:', nineteenDaysAgo);

    const toDateFormatted = today.toISOString(); // Chuyển đổi ngày thành chuỗi ISO
    const nineteenDaysAgoFormatted = nineteenDaysAgo.toISOString(); // Chuyển đổi ngày thành chuỗi ISO

    const overdueTransactions = await BookTransaction.find({
      toDate: { $lt: toDateFormatted, $gte: nineteenDaysAgoFormatted },
      transactionStatus: 'True' // Thêm điều kiện transactionStatus
    });
    console.log('Number of overdue transactions:', overdueTransactions.length);

    for (const transaction of overdueTransactions) {
      const bookIds = transaction.books; // Lấy danh sách các _id sách từ transaction
      const books = await Book.find({ _id: { $in: bookIds } }); // Tìm kiếm các sách có _id trong danh sách bookIds
      for (const book of books) {
        await Notify.create({
          NotifyName: `Sách quá hạn từ ngày ${transaction.fromDate}`,
          description: `Cuốn sách ${book.bookName} bị quá hạn. Hãy trả sớm cho thư viện!`,
          NotifyStatus: 1,
          NotifyType: "out of date",
          transactions: [transaction._id],
          books: [book._id],
        });
      }
    }


    console.log('Overdue notifications created successfully.');
  } catch (error) {
    console.error('Error creating overdue notifications:', error);
  }
});



app.get("/", (req, res) => {
  res.status(200).send("Welcome to Kiet's Library API");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
