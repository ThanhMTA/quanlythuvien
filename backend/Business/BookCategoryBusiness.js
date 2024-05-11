
import BookCategoryDao from '../Dao/BookCategoryDao.js'


class BookCategoryBusiness {
    constructor() {
        this.bookCategory = new BookCategoryDao();
    }

    // Tìm kiếm danh mục sách theo tên
    async getCategoriesByName(name) {
        try {
            const categories = await this.bookCategory.getCategoriesByName({ categoryName: name });
            return categories;
        } catch (error) {
            throw new Error("Could not find categories by name: " + error.message);
        }
    }

    // Thêm một danh mục sách mới
    async addCategory(categoryData) {
        try {
            const newCategory = await this.bookCategory.addCategory(categoryData);
            return newCategory;
        } catch (error) {
            throw new Error("Could not add category: " + error.message);
        }
    }

    // Cập nhật thông tin của một danh mục sách
    async updateCategory(categoryId, updatedData) {
        try {
            const updatedCategory = await this.bookCategory.updateCategory(categoryId, updatedData);
            return updatedCategory;
        } catch (error) {
            throw new Error("Could not update category: " + error.message);
        }
    }

    // Xóa một danh mục sách
    async deleteCategory(categoryId) {
        try {
            const deletedCategory = await this.bookCategory.deleteCategory(categoryId);
            return deletedCategory;
        } catch (error) {
            throw new Error("Could not delete category: " + error.message);
        }
    }

    // Lấy tất cả danh mục sách
    async getAllCategories() {
        try {
            const allCategories = await this.bookCategory.getAllCategories();
            return allCategories;
        } catch (error) {
            throw new Error("Could not fetch all categories: " + error.message);
        }
    }

    // Lấy thông tin của một danh mục sách dựa trên ID
    async getCategoryById(categoryId) {
        try {
            const category = await this.bookCategory.getCategoryById(categoryId);
            return category;
        } catch (error) {
            throw new Error("Could not find category by ID: " + error.message);
        }
    }
}

export default BookCategoryBusiness;
