import express from "express";
import User from "../models/User.js";
import BookTransaction from "../models/BookTransaction.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signin } from "../Controller/auth.js";
import authJwt from "../middleware/authJwt.js";
import {
  user_list, user_create_post,
  user_delete_get, user_delete, user_update_get,
  user_update_put, user_detail
} from '../Controller/User.js';
const router = express.Router();
const tinhTuoi = (ngaySinh) => {
  var today = new Date();
  var birthDate = new Date(ngaySinh);
  var age = today.getFullYear() - birthDate.getFullYear();
  var monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  console.log(birthDate);
  return age;
}

router.post('/register', user_create_post);

router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");
    const user = await User.findOne({ email: req.body.email });

    console.log("user", user.password);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json("Wrong Password");
    }


    // Tạo token JWT
    const token = jwt.sign({ _id: user._id }, 'your_secret_key_here'); // Thay đổi 'your_secret_key_here' thành một chuỗi bí mật thực sự
    const userToken = token;
    // Trả về thông tin người dùng và token
    res.header('auth-token', token).json({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});
router.post("/signin_test", signin);

export default router;

