import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userType: { 
        type: String,
        required: true
    },
    userFullName: { 
        
        type: String,
        required: true,
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    dob: {
        type: String
    },
    address: {
        type: String,
        default: ""
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    points: {
        type: Number,
        default: 0
    },
    activeTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    prevTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

export default User;

// CRUD Operations for User model

// Create a new user
export const addUser = async (userData) => {
    try {
        const newUser = await User.create(userData);
        return newUser;
    } catch (error) {
        throw new Error("Could not create user: " + error.message);
    }
};

// Read all users
export const getAllUsers = async () => {
    try {
        const allUsers = await User.find();
        return allUsers;
    } catch (error) {
        throw new Error("Could not fetch users: " + error.message);
    }
};

// Read a single user by ID
export const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw new Error("Could not find user: " + error.message);
    }
};

// Update a user by ID
export const updateUser = async (userId, updatedData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        return updatedUser;
    } catch (error) {
        throw new Error("Could not update user: " + error.message);
    }
};

// Delete a user by ID
export const deleteUser = async (userId) => {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        return deletedUser;
    } catch (error) {
        throw new Error("Could not delete user: " + error.message);
    }
};
