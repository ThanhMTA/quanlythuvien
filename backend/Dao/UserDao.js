import Dao from './Dao.js';
import User from '../models/User.js';
import bcrypt from "bcrypt";

// Tính tuổi từ ngày sinh
function tinhTuoi(dob) {
    if (!dob) {
        throw new Error("Invalid date of birth");
    }
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age;
}

class UserDao extends Dao {
    constructor() {
        super(User);
    }

    // Create a new user
    // Create a new user
    async addUser(userData) {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(userData.password, salt);
        try {
            const newUser = await new User({
                userType: userData.userType,
                userFullName: userData.userFullName,
                dob: userData.dob,
                gender: userData.gender,
                address: userData.address,
                mobileNumber: userData.mobileNumber,
                email: userData.email,
                password: hashedPass,
                isAdmin: userData.isAdmin,
                age: tinhTuoi(userData.dob)
            }).save();

            return newUser;
        } catch (error) {
            throw new Error("Could not add user: " + error.message);
        }
    }


    // Read all users
    // async getAllUsers() {
    //     try {
    //         const allUsers = await this.getAll();
    //         return allUsers;
    //     } catch (error) {
    //         throw new Error("Could not fetch users: " + error.message);
    //     }
    // }
    async getAllUsers() {
        try {
            // Lấy thông tin tất cả người dùng từ cơ sở dữ liệu, chỉ lấy các trường cần thiết
            const users = await User.find({}).select('userType userFullName dob gender address mobileNumber email isAdmin photo points age  password');

            if (!users) {
                throw new Error('Users not found');
            }

            // Tính tuổi từ ngày sinh và thêm vào kết quả

            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }



    // Read a single user by ID
    async getUserById(userId) {
        try {
            // Lấy thông tin tất cả người dùng từ cơ sở dữ liệu, chỉ lấy các trường cần thiết
            const users = await User.findById(userId).select('userType userFullName dob gender address mobileNumber email isAdmin photo points age  password');

            if (!users) {
                throw new Error('Users not found');
            }

            // Tính tuổi từ ngày sinh và thêm vào kết quả

            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }

    // Update a user by ID
    async updateUser(userId, updatedData) {
        try {
            const {
                userType,
                userFullName,
                dob,
                gender,
                address,
                mobileNumber,
                email,
                isAdmin,
                photo,
                points,
                age
                // password
            } = updatedData;
            // const salt = await bcrypt.genSalt(10);
            // const hashedPass = await bcrypt.hash(updatedData.password, salt);
            // password = hashedPass
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    userType,
                    userFullName,
                    dob,
                    gender,
                    address,
                    mobileNumber,
                    email,
                    password,
                    isAdmin,
                    photo,
                    points,
                    age
                    // password
                },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser;
        } catch (error) {
            throw new Error("Could not update user: " + error.message);
        }
    }

    // Delete a user by ID
    async deleteUser(userId) {
        try {
            const deletedUser = await this.delete(userId);
            return deletedUser;
        } catch (error) {
            throw new Error("Could not delete user: " + error.message);
        }
    }
    // tính số lượng người dùng 
    async countUser() {
        try {
            const count = await this.model.count();
            return count;
        } catch (error) {
            throw new Error("Could not count books: " + error.message);
        }
    }
    //  lấy các giao dịch của người dùng => tính ponts => update thì update lại tuổi 
}


export default UserDao;
