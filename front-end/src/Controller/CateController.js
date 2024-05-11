import TransApi from "../callAPI/trans.js"
import BookApi from "../callAPI/BookApi.js";
import UserApi from "../callAPI/user.js";
import CateApi from "../callAPI/cateAPI.js";
const CateController = {
    getAllCates: async () => {
        try {
            const allCates = await CateApi.GetAllCates();
            console.log("Book", allCates)
            // Xử lý dữ liệu nếu cần
            return allCates;
        } catch (error) {
            // Xử lý lỗi nếu cần
            console.error("Error in getting all books:", error);
            throw error;
        }
    },

    // Các hàm controller khác có thể được thêm ở đây
};
export default CateController;
