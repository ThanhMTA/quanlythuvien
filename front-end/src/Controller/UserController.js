import TransApi from "../callAPI/trans.js"
import BookApi from "../callAPI/BookApi.js";
import UserApi from "../callAPI/user.js";
const UserController = {
    getAllUsers: async () => {
        try {
            const allUsers = await UserApi.getAllUser();
            console.log("user", allUsers)
            // Xử lý dữ liệu nếu cần
            return allUsers;
        } catch (error) {
            // Xử lý lỗi nếu cần
            console.error("Error in getting all user:", error);
            throw error;
        }
    },
    getUser: async (UserId) => {
        try {
            const user = await UserApi.getUserbyID(UserId);
            console.log("User", user)
            // Xử lý dữ liệu nếu cần
            return user;
        } catch (error) {
            // Xử lý lỗi nếu cần
            console.error("Error in getting user:", error);
            throw error;
        }
    },
    updateUser: async (userId, data) => {
        try {
            const User = await UserApi.updateUser(userId, data);
            return User;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },
    addUser: async (transactionData) => {
        try {
            const User = await UserApi.addUser(transactionData);
            return User;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },
    // Các hàm controller khác có thể được thêm ở đây
};
export default UserController;
