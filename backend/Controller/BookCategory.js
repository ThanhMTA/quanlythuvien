// Filename: controllers/bookCategory.js
import BookCategoryService from '../Service/BookCategoryService.js';

// Create an instance of BookCategoryService to perform operations with the BookCategory model
const BookCategory = new BookCategoryService();

// Display a list of all book categories
export const category_list = async (req, res) => {
    console.log('book category list controller');
    try {
        const categories = await BookCategory.getAllCategories();
        if (categories.length === 0) {
            res.send('NO CATEGORIES FOUND: No categories found in database');
        } else {
            res.json(categories);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Display details of a specific book category
export const category_detail = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await BookCategory.getCategoryById(categoryId);
        if (!category) {
            res.send('CATEGORY NOT FOUND: Category not found in database');
        } else {
            res.json(category);
        }
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Display a form to create a book category
export const category_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Category create GET');
};

// Create a book category using the POST method
export const category_create_post = async (req, res) => {
    // if (req.body.isAdmin) {
        console.log('category create controller post');
        const categoryData = req.body;
        console.log(categoryData);
        try {
            const newCategory = await BookCategory.addCategory(categoryData);
            const result = {
                result: "success",
                message: "Category inserted successfully",
                data: newCategory
            };
            res.json(result);
        } catch (error) {
            console.error('Error adding category:', error);
            const result = {
                result: "fail",
                message: "Could not add category: " + error.message
            };
            res.json(result);
        }
    // }
    // else {
    //     return res.status(403).json("You dont have permission to get transaction!");
    // }
};

// Display a form to update a book category
export const category_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Category update GET');
};

// Update a book category using the POST method
export const category_update_put = async (req, res) => {
    if(req.body.isAdmin){
    console.log('category update controller [put]');
    const categoryId = req.params.id;
    const updatedData = req.body;
    console.log(updatedData);
    try {
        const updatedCategory = await BookCategory.updateCategory(categoryId, updatedData);
        const result = {
            result: "success",
            message: "Category updated successfully",
            data: updatedCategory
        };
        console.log('CategoryUpdated', result);
        res.json(result);
    } catch (error) {
        console.error('Error updating category:', error);
        const result = {
            result: "fail",
            message: "Could not update category: " + error.message
        };
        res.json(result);
    }
}
else {
    return res.status(403).json("You dont have permission to get transaction!");
}
};

// Display a form to delete a book category
export const category_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Category delete GET');
};
// Delete a book category using the POST method
export const category_delete = async (req, res) => {
    if(req.body.isAdmin){
    console.log('category delete controller [post]');
    const categoryId = req.params.id;
    try {
        const deletedCategory = await BookCategory.deleteCategory(categoryId);
        const result = {
            result: "success",
            message: "Category deleted successfully",
            data: deletedCategory
        };
        console.log('CategoryDeleted', result);
        res.json(result);
    } catch (error) {
        console.error('Error deleting category:', error);
        const result = {
            result: "fail",
            message: "Could not delete category: " + error.message
        };
        res.json(result);
    }
}
    else {
        return res.status(403).json("You dont have permission to get transaction!");
    }
};
