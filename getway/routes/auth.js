
import express from 'express';


const API_URL = 'http://localhost:5000/api/auth';
const router = express.Router();


// router.post('/register', user_create_post);
router.post('/register', async (req, res) => {
    try {
        const userData = req.body; // Lấy dữ liệu sách từ req.body

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData) // Chuyển dữ liệu sách sang định dạng JSON và gửi đi
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// /* User Login */


// router.post("/signin", async (req, res) => {
//   try {
//     console.log(req.body, "req");
//     const user = await User.findOne({ email: req.body.email });

//     console.log("user", user.password);

//     if (!user) {
//       return res.status(404).json("User not found");
//     }

//     const validPass = await bcrypt.compare(req.body.password, user.password);
//     if (!validPass) {
//       return res.status(400).json("Wrong Password");
//     }


//     // Tạo token JWT
//     const token = jwt.sign({ _id: user._id }, 'your_secret_key_here'); // Thay đổi 'your_secret_key_here' thành một chuỗi bí mật thực sự
//     const userToken = token;
//     // Trả về thông tin người dùng và token
//     res.header('auth-token', token).json({ token, user });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json("Internal Server Error");
//   }
// });
router.post('/signin', async (req, res) => {
    try {
        const userData = req.body; // Lấy dữ liệu sách từ req.body
        console.log("gateway test signin")
        const response = await fetch(`${API_URL}/signin_test`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData) // Chuyển dữ liệu sách sang định dạng JSON và gửi đi
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

