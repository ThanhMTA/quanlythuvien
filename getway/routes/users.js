import express from 'express';


const API_URL = 'http://localhost:5000/api/users';
const router = express.Router();


// // export default router;
// // Filename: routes/user.js
// import express from 'express';
// import {
//     user_list, user_create_post,
//     user_delete_get, user_delete, user_update_get,
//     user_update_put, user_detail
// } from '../Controller/User.js';

// const router = express.Router();
// /// USER ROUTES ///

// /* GET request for list of all users. */
// router.get('/allmembers', user_list);
// router.get('/allmembers', async (req, res) => {
//     try {


//         const response = await fetch(`${API_URL}/allmembers`);
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.get('/allmembers', async (req, res) => {
    try {
        // Lấy token từ tiêu đề yêu cầu
        const token = req.headers.authorization;
        console.log("token tesst " + token)
        // Tạo các tùy chọn yêu cầu bao gồm tiêu đề Authorization với token
        const requestOptions = {
            headers: {
                Authorization: token
            }
        };

        // Gửi yêu cầu GET với tiêu đề Authorization chứa token
        const response = await fetch(`${API_URL}/allmembers`, requestOptions);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// /* POST request for creating a user. */
// router.post('/adduser', user_create_post);
router.post('/adduser', async (req, res) => {
    try {
        const token = req.headers.authorization;
        console.log("token tesst " + token)
        // Tạo các tùy chọn yêu cầu bao gồm tiêu đề Authorization với token
        const requestOptions = {
            headers: {
                Authorization: token
            }
        };
        const userData = req.body; // Lấy dữ liệu sách từ req.body

        const response = await fetch(`${API_URL}/adduser`, {
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
// /* GET request to delete a user. */
// // router.get('/user/:id/delete', user_delete_get);

// // POST request to delete a user
// router.delete('/deleteuser/:id', user_delete);
router.delete('/deleteuser/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const response = await fetch(`${API_URL}/deleteuser/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// /* GET request to update a user. */
// // router.get('/user/:id/update', user_update_get);

// // POST request to update a user
// router.put('/updateuser/:id', user_update_put);
router.put('/updateuser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedBookData = req.body; // Dữ liệu sách được cập nhật từ req.body

        const response = await fetch(`${API_URL}/updateuser/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBookData) // Chuyển dữ liệu sách cập nhật sang định dạng JSON và gửi đi
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// /* GET request for one user. */
// router.get('/getuser/:id', user_detail);
router.get('/getuser/:id', async (req, res) => {
    try {
        const id = req.params.id; // Lấy cateName từ req.params
        const response = await fetch(`${API_URL}/getuser/${id}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;
