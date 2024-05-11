import TransApi from "../callAPI/trans.js"
import BookApi from "../callAPI/BookApi.js";
import UserApi from "../callAPI/user.js";
const TransController = {
    getAllTrans: async () => {
        try {
            // Lấy tất cả các giao dịch
            const allTransactions = await TransApi.getAllTrans();
            console.log("thanh1e", allTransactions)
            // Tạo một mảng các promise để thực hiện các cuộc gọi không đồng bộ một cách song song
            const promises = allTransactions.map(async transaction => {
                const userId = transaction.borrowerId;
                const bookId = transaction.books;
                // Kiểm tra xem userId và bookIds có tồn tại không
                if (!userId || !bookId || bookId.length === 0) {
                    console.warn(`Transaction ${transaction._id} is missing userId or bookIds`);
                    return null; // Trả về null nếu dữ liệu không đủ để xử lý
                }
                // Lấy thông tin của user dựa trên userId
                const userPromise = UserApi.getUserbyID(userId);

                // // Lấy thông tin của các sách dựa trên các bookId
                const bookPromises = BookApi.getBookbyID(bookId);

                // Chờ cho tất cả các cuộc gọi không đồng bộ hoàn thành
                const user = await userPromise;
                const book = await bookPromises;
                // console.log("hoo", book)
                // Trả về thông tin user và sách cho giao dịch này
                const toDate = new Date(transaction.toDate).toLocaleDateString('en-GB');
                const fromday = new Date(transaction.fromDate).toLocaleDateString('en-GB');
                // Lấy ngày hiện tại
                const currentDate = new Date();
                let differenceInDays
                // Chuyển fromday từ định dạng chuỗi sang đối tượng ngày
                const D1 = new Date(transaction.toDate);
                const D2 = new Date(transaction.returnDate);

                // Tính toán số ngày chênh lệch giữa hai ngày
                if (transaction.transactionStatus === "True") {
                    differenceInDays = Math.ceil((currentDate - D1) / (1000 * 60 * 60 * 24));
                }
                if (transaction.transactionStatus === "False") {
                    differenceInDays = Math.ceil((D2 - D1) / (1000 * 60 * 60 * 24));
                    if (differenceInDays <= 0) {
                        differenceInDays = 0
                    }
                }


                return {
                    userName: user.userFullName,
                    books: book.bookName,
                    _id: transaction._id,
                    fromDate: fromday,
                    toDate: toDate,
                    returnDate: transaction.returnDate,
                    createdAt: transaction.createdAt,
                    transactionStatus: transaction.transactionStatus,
                    overdue: differenceInDays
                };
            });

            // Chờ cho tất cả các promise hoàn thành và loại bỏ các phần tử null
            const transactionDetails = await Promise.all(promises);
            console.log("thanh1fdge", transactionDetails)

            // return transactionDetails.filter(transaction => transaction !== null);
            return transactionDetails
        } catch (error) {
            console.error("Error:", error);
            throw error; // Throw lỗi để xử lý ở phía gọi hàm nếu cần
        }
    },
    getTransByUser: async (UserId) => {
        try {
            // Lấy tất cả các giao dịch
            const allTransactions = await TransApi.getTransbyUser(UserId);
            console.log("thanh1e", allTransactions)
            // Tạo một mảng các promise để thực hiện các cuộc gọi không đồng bộ một cách song song
            const promises = allTransactions.map(async transaction => {
                const userId = transaction.borrowerId;
                const bookId = transaction.books;
                // Kiểm tra xem userId và bookIds có tồn tại không
                if (!userId || !bookId || bookId.length === 0) {
                    console.warn(`Transaction ${transaction._id} is missing userId or bookIds`);
                    return null; // Trả về null nếu dữ liệu không đủ để xử lý
                }

                // Lấy thông tin của user dựa trên userId
                const userPromise = UserApi.getUserbyID(userId);

                // // Lấy thông tin của các sách dựa trên các bookId
                const bookPromises = BookApi.getBookbyID(bookId);

                // Chờ cho tất cả các cuộc gọi không đồng bộ hoàn thành
                const user = await userPromise;
                const book = await bookPromises;
                // console.log("hoo", book)
                // Trả về thông tin user và sách cho giao dịch này
                const toDate = new Date(transaction.toDate).toLocaleDateString('en-GB');
                const fromday = new Date(transaction.fromDate).toLocaleDateString('en-GB');

                return {
                    userName: user.userFullName,
                    books: book.bookName,
                    _id: transaction._id,
                    fromDate: fromday,
                    toDate: toDate,
                    returnDate: transaction.returnDate,
                    createdAt: transaction.createdAt,
                    transactionStatus: transaction.transactionStatus
                };
            });

            // Chờ cho tất cả các promise hoàn thành và loại bỏ các phần tử null
            const transactionDetails = await Promise.all(promises);
            console.log("thanh1fdge", transactionDetails)

            // return transactionDetails.filter(transaction => transaction !== null);
            return transactionDetails
        } catch (error) {
            console.error("Error:", error);
            throw error; // Throw lỗi để xử lý ở phía gọi hàm nếu cần
        }
    },
    addTransaction: async (transactionData) => {
        try {
            const addedTransaction = await TransApi.addTrans(transactionData);
            return addedTransaction;
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    },
    updateTransaction: async (transactionId, data) => {
        try {
            const updatedTransaction = await TransApi.updateTrans(transactionId, data);
            return updatedTransaction;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }
    // Các hàm controller khác có thể được thêm ở đây
};
export default TransController;
