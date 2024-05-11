import express from 'express';


const API_URL = 'http://localhost:5000/api/categories';
const router = express.Router();



// /// BOOK CATEGORY ROUTES ///

// /* GET request for list of all book categories. */
// router.get('/allcategories', category_list);
router.get('/allcategories', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/allcategories`);

        // Kiểm tra trạng thái của phản hồi trước khi gọi json()
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);

        // Xử lý các loại lỗi cụ thể
        if (error instanceof FetchError) {
            res.status(500).json({ error: 'Failed to fetch categories' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// /* POST request for creating a book category. */
// router.post('/addcategory', category_create_post);

// // /* GET request to delete a book category. */
// // router.get('/category/:id/delete', category_delete_get);

// // // POST request to delete a book category
// // router.post('/category/:id/delete', category_delete_post);

// // /* GET request to update a book category. */
// // router.get('/category/:id/update', category_update_get);

// // // POST request to update a book category
// // router.post('/category/:id/update', category_update_post);

// // /* GET request for one book category. */
// // router.get('/getcategory/:id', category_detail);

export default router;
