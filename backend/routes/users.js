// import express from "express";
// import User from "../models/User.js";
// import bcrypt from "bcrypt";

// const router = express.Router()

// const tinhTuoi = (ngaySinh) => {
//     var today = new Date();
//     var birthDate = new Date(ngaySinh);
//     var age = today.getFullYear() - birthDate.getFullYear();
//     var monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     console.log(birthDate);
//     return age;
//   }

// router.get("/allmembers", async (req,res) => {
//     try{
//         const users = await User.find({}).populate("activeTransactions").populate("prevTransactions").sort({_id:-1});
//         res.status(200).json(users);

//     }catch(err){
//         return res.status(500).json(err);
//     }
// })

// /* Adding book */
// router.post("/adduser", async (req, res) => {
//     if (req.body.isAdmin) {
//         try {
//             /* Salting and Hashing the Password */
//             const salt = await bcrypt.genSalt(10);
//             const hashedPass = await bcrypt.hash(req.body.password, salt);
//             /* Create a new user */
//             const newuser = await new User({
//               userType: req.body.userType,
//               userFullName: req.body.userFullName,
//               age: tinhTuoi(req.body.dob),
//               dob: req.body.dob,
//               gender: req.body.gender,
//               address: req.body.address,
//               mobileNumber: req.body.mobileNumber,
//               email: req.body.email,
//               password: hashedPass,
//               isAdmin: req.body.isAdmin,
//             });

//             console.log("tai khoan", newuser);


//             /* Save User and Return */
//             const user = await newuser.save();
//             res.status(200).json(user);
//         } catch (err) {
//             console.log(err);
//         }
//     }
//     else {
//         return res.status(403).json("You dont have permission to delete a book!");
//     }
// })


// router.get("/getuser/:id", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).populate("activeTransactions").populate("prevTransactions").populate("books")
//         const { password, updatedAt, ...other } = user._doc;
//         res.status(200).json(other);
//     } 
//     catch (err) {
//         return res.status(500).json(err);
//     }
// })


// router.put("/updateuser/:id", async (req, res) => {
//     if (req.body.userId === req.params.id || req.body.isAdmin) {
//         if (req.body.password) {
//             try {
//                 const salt = await bcrypt.genSalt(10);
//                 req.body.password = await bcrypt.hash(req.body.password, salt);
//             } catch (err) {
//                 return res.status(500).json(err);
//             }
//         }
//         try {
//             const user = await User.findByIdAndUpdate(req.params.id, {
//                 $set: req.body,
//             });
//             res.status(200).json("Account has been updated");
//         } catch (err) {
//             return res.status(500).json(err);
//         }
//     }
//     else {
//         return res.status(403).json("You can update only your account!");
//     }
// })



// router.put("/:id/move-to-activetransactions", async (req, res) => {
//     if(req.body.isAdmin){
//         try{
//             const user = await User.findById(req.body.userId);
//             await user.updateOne({$push:{activeTransactions: req.params.id}});
//             res.status(200).json("Added to Active Transaction");
//         }catch (err){
//             res.status(500).json(err);
//         }
//     }else{
//         res.status(403).json("Only Admin can add a transaction");
//     }
// })


// router.put("/:id/move-to-prevtransactions", async (req, res) => {
//     if(req.body.isAdmin){
//         try{
//             const user = await User.findById(req.body.userId);
//             await user.updateOne({$pull: {activeTransactions: req.params.id}});
//             await user.updateOne({$push: {prevTransactions: req.params.id}});
//             res.status(200).json("Added to previous transaction")
//         }catch(err){
//             res.status(500).json(err);

//         }
//     }else{
//         res.status(403).json("Only Admin can do this");
//     }
// });

// router.delete("/deleteuser/id", async (req, res) => {
//     if(req.body.userId === req.params.id || req.body.isAdmin){
//         try{
//             await User.findByIdAndDelete(req.params.id);
//             res.status(200).json("Account has been deleted");

//         }catch(err){
//             return res.status(403).json("You can delete only your account!");

//         }
//     }
// })


// export default router;
// Filename: routes/user.js
import express from 'express';
import {
    user_list, user_create_post,
    user_delete_get, user_delete, user_update_get,
    user_update_put, user_detail
} from '../Controller/User.js';
import verifyToken from './token.js';
import authJwt from "../middleware/authJwt.js";
import passport from 'passport'
const router = express.Router();


/// USER ROUTES ///
router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
/* GET request for list of all users. */
router.get('/allmembers',  [authJwt.verifyToken], user_list);

/* POST request for creating a user. */
router.post('/adduser', user_create_post);

/* GET request to delete a user. */
// router.get('/user/:id/delete', user_delete_get);

// POST request to delete a user
router.delete('/deleteuser/:id', user_delete);

/* GET request to update a user. */
// router.get('/user/:id/update', user_update_get);

// POST request to update a user
router.put('/updateuser/:id', user_update_put);

/* GET request for one user. */
router.get('/getuser/:id', user_detail);

export default router;
