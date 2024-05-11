// Filename: controllers/user.js
import UserService from '../Service/UserService.js';
import multer from 'multer';
import path from 'path';
import verifyToken from '../routes/token.js';
import jwt from "jsonwebtoken";
// Create an instance of UserService to perform operations with the User model
const userService = new UserService();
import fs from 'fs';
// Display a list of all users
// export const user_list = async (req, res) => {
//     console.log('kiem tra tocken');
//     await verifyToken(req, res);
//     console.log('user list controller');
//     try {
//         const users = await userService.getAllUsers();
//         if (users.length === 0) {
//             res.send('NO USERS FOUND: No users found in database');
//         } else {
//             res.json(users);
//         }
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };
export const user_list = async (req, res) => {
    try {
       
        // Kiểm tra xem token có trong header không
        // const token = req.header('auth-token');
        // if (!token) {
        // console.log('khong co token');
        //     return res.status(401).json({ message: "Access Denied" });
        // }

        // // Xác minh token
        // const verified = jwt.verify(token, 'your_secret_key_here'); // Thay đổi 'your_secret_key_here' thành một chuỗi bí mật thực sự
        // if (!verified) {
        //     return res.status(401).json({ message: "Invalid Token" });
        // }
        console.log('user list controller');

        const users = await userService.getAllUsers();
        if (users.length === 0) {
            return res.status(404).json({ message: 'NO USERS FOUND: No users found in database' });
        }

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Display details of a specific user
export const user_detail = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            res.send('USER NOT FOUND: User not found in database');
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Display a form to create a user
export const user_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: User create GET');
};

// Create a user using the POST method
export const user_create_post = async (req, res) => {
    console.log('kiem tra tocken');
    // await verifyToken(req, res);
    console.log('user create controller post');
    const userData = req.body;
    console.log(userData);
    try {
        const newUser = await userService.addUser(userData);
        const result = {
            result: "success",
            message: "User inserted successfully",
            data: newUser
        };
        res.json(result);
    } catch (error) {
        console.error('Error adding user:', error);
        const result = {
            result: "fail",
            message: "Could not add user: " + error.message
        };
        res.json(result);
    }
};

// Display a form to update a user
export const user_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: User update GET');
};

// Update a user using the POST method
export const user_update_put = async (req, res) => {
    console.log('user update controller [put]');
    const userId = req.params.id;
    console.log('userId:', userId);
    const updatedData = req.body;
    console.log('req.body:', req.body._id);
    try {
        const updatedUser = await userService.updateUser(userId, updatedData);
        const result = {
            result: "success",
            message: "User updated successfully",
            data: updatedUser
        };
        console.log('UserUpdated', result);
        res.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        const result = {
            result: "fail",
            message: "Could not update user: " + error.message
        };
        res.json(result);
    }
};

// Display a form to delete a user
export const user_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: User delete GET');
};

// Delete a user using the POST method
export const user_delete = async (req, res) => {
    if (req.body.isAdmin) {
        console.log('user delete controller [delete]');
        const userId = req.params.id;
        try {
            const deletedUser = await userService.deleteUser(userId);
            const result = {
                result: "success",
                message: "User deleted successfully",
                data: deletedUser
            };
            console.log('UserDeleted', result);
            res.json(result);
        } catch (error) {
            console.error('Error deleting user:', error);
            const result = {
                result: "fail",
                message: "Could not delete user: " + error.message
            };
            res.json(result);
        }
    }
    else {
        return res.status(403).json("You dont have permission to get transaction!");
    }
};
