import express, { Router } from 'express';
import { CategoryController } from './category.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

// Public route - Get all categories
router.get("/",
    CategoryController.getAllCategories
);

// Public route - Get single category by ID
router.get("/:id",
    CategoryController.getCategoryById
);

// Admin only - Create category
router.post(
    "/",
    auth(UserRole.ADMIN),
    CategoryController.createCategory
);

// Admin only - Update category
router.patch(
    "/:id",
    auth(UserRole.ADMIN),
    CategoryController.updateCategory
);

// Admin only - Delete category (soft delete)
router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    CategoryController.deleteCategory
);

export const CategoryRouter: Router = router;