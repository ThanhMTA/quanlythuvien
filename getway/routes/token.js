// import jwt from "jsonwebtoken";
// // Tạo một middleware để kiểm tra token
// export const verifyToken = (req, res, next) => {
//     const token = req.header('auth-token'); // Lấy token từ header

//     if (!token) {
//         return res.status(401).json({ message: 'Access denied. Token is missing.' });
//     }

//     try {
//         const verified = jwt.verify(token, 'your_secret_key_here'); // Xác thực token
//         req.user = verified; // Lưu thông tin người dùng đã xác thực vào request
//         next(); // Cho phép tiếp tục xử lý các tuyến đường tiếp theo
//     } catch (error) {
//         res.status(400).json({ message: 'Invalid token.' });
//     }
// };
