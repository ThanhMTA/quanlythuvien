
import UserBusiness from '../Business/UserBusiness.js'

class UserService {
    constructor() {
        this.userDao = new UserBusiness();
    }

    // Create a new user
    async addUser(userData) {
        try {
            const newUser = await this.userDao.addUser(userData);
            return newUser;
        } catch (error) {
            throw new Error("Could not create user: " + error.message);
        }
    }

    // Read all users
    async getAllUsers() {
        try {
            const allUsers = await this.userDao.getAllUsers();
            return allUsers;
        } catch (error) {
            throw new Error("Could not fetch users: " + error.message);
        }
    }

    // Read a single user by ID
    async getUserById(userId) {
        try {
            const user = await this.userDao.getUserById(userId);
            return user;
        } catch (error) {
            throw new Error("Could not find user: " + error.message);
        }
    }

    // Update a user by ID
    async updateUser(userId, updatedData) {
        try {
            const updatedUser = await this.userDao.updateUser(userId, updatedData);
            return updatedUser;
        } catch (error) {
            throw new Error("Could not update user: " + error.message);
        }
    }

    // Delete a user by ID
    async deleteUser(userId) {
        try {
            const deletedUser = await this.userDao.deleteUser(userId);
            return deletedUser;
        } catch (error) {
            throw new Error("Could not delete user: " + error.message);
        }
    }
    async countUser() {
        try {
            const count = await this.userDao.countUser();
            return count;
        } catch (error) {
            throw new Error("Could not count books: " + error.message);
        }
    }
}

export default UserService;
