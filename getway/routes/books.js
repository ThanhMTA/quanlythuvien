


import express from 'express';


const API_URL = 'http://localhost:5000/api';
const router = express.Router();

/// BOOK ROUTES ///

/* GET book home page. will get all book list */

/* GET request for creating a Book. NOTE This must come before routes that display Book (uses id) */
// router.get('/book/create', book_create_get);

// /* POST request for creating Book. */
// router.post('/addbook', verifyToken, book_create_post);
router.post('/addbook', async (req, res) => {
    try {
        const bookData = req.body; // Lấy dữ liệu sách từ req.body

        const response = await fetch(`${API_URL}/books/addbook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization
            },
            body: JSON.stringify(bookData) // Chuyển dữ liệu sách sang định dạng JSON và gửi đi
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// /* GET request to delete Book. */
// router.get('/removebook/:id', verifyToken, book_delete_get);

// // POST request to delete Book
// router.delete('/removebook/:id', verifyToken, book_delete);
router.delete('/removebook/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const response = await fetch(`${API_URL}/books/removebook/${id}`, {
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

// /* GET request to update Book. */
// router.get('/updatebook/:id', verifyToken, book_update_get);

// // POST request to update Book
// router.put('/updatebook/:id', verifyToken, book_update_put);
router.put('/updatebook/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedBookData = req.body; // Dữ liệu sách được cập nhật từ req.body

        const response = await fetch(`${API_URL}/books/updatebook/${id}`, {
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

// /* GET request for one Book. */
// router.get('/getbook/:id', book_detail);

router.get('/getbook/:id', async (req, res) => {
    try {
        const id = req.params.id; // Lấy cateName từ req.params
        const response = await fetch(`${API_URL}/books/getbook/${id}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// /* GET request for list of all Book items. */
// router.get('/allbooks', verifyToken, book_list);
router.get('/allbooks', async (req, res) => {
    try {


        const response = await fetch(`${API_URL}/books/allbooks`,
            {
                headers: {
                    'Authorization': req.headers.authorization
                }
            });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// router.get('/getallcates', categories_list);
router.get('/getallcates', async (req, res) => {
    try {


        const response = await fetch(`${API_URL}/books/getallcates`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// router.get('/getbycate/:cateName', categories_list_book);
router.get('/getbycate/:cateName', async (req, res) => {
    try {
        const cateName = req.params.cateName; // Lấy cateName từ req.params
        const response = await fetch(`${API_URL}/books/getbycate/${cateName}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// router.get('/search/:key', book_search);

// /* lấy số lượng sách*/
// router.get('/count', getBookCount);
router.get('/count', async (req, res) => {
    try {


        const response = await fetch(`${API_URL}/books/count`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;
