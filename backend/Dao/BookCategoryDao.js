import Dao from './Dao.js';
import BookCategory from '../models/BookCategory.js';

class BookCategoryDao extends Dao {
    constructor() {
        super(BookCategory);
    }

    // Tìm kiếm danh mục sách theo tên
    async getCategoriesByName(name) {
        try {
            const categories = await this.model.find({ categoryName: name });
            return categories;
        } catch (error) {
            throw new Error("Could not find categories by name: " + error.message);
        }
    }

    // Thêm một danh mục sách mới
    async addCategory(categoryData) {
        
        try {
            const newCategory = await this.save(categoryData);
            return newCategory;
        } catch (error) {
            throw new Error("Could not add category: " + error.message);
        }
    }

    // Cập nhật thông tin của một danh mục sách
    async updateCategory(categoryId, updatedData) {
        try {
            const updatedCategory = await this.update(categoryId, updatedData);
            return updatedCategory;
        } catch (error) {
            throw new Error("Could not update category: " + error.message);
        }
    }

    // Xóa một danh mục sách
    async deleteCategory(categoryId) {
        try {
            const deletedCategory = await this.delete(categoryId);
            return deletedCategory;
        } catch (error) {
            throw new Error("Could not delete category: " + error.message);
        }
    }

    // Lấy tất cả danh mục sách
    async getAllCategories() {
        try {
            const allCategories = await this.getAll();
            return allCategories;
        } catch (error) {
            throw new Error("Could not fetch all categories: " + error.message);
        }
    }

    // Lấy thông tin của một danh mục sách dựa trên ID
    async getCategoryById(categoryId) {
        try {
            const category = await this.getById(categoryId);
            return category;
        } catch (error) {
            throw new Error("Could not find category by ID: " + error.message);
        }
    }
}

export default BookCategoryDao;
