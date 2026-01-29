import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service.js";
import { UserRole } from "../../middlewares/auth.js";

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (e) {
        next(e);
    }
}

const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(400).json({
                error: "Category ID is required"
            });
        }

        const category = await categoryService.getCategoryById(categoryId as string);
        if (!category) {
            return res.status(404).json({
                error: "Category not found"
            });
        }
        res.status(200).json(category);
    } catch (e) {
        next(e);
    }
}

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                error: "Forbidden - Admin access required"
            });
        }

        const result = await categoryService.createCategory(req.body);
        res.status(201).json(result);
    } catch (e) {
        next(e);
    }
}

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                error: "Forbidden - Admin access required"
            });
        }

        const categoryId = req.params.id;
        const updateData = req.body;

        const updatedCategory = await categoryService.updateCategory(categoryId as string, updateData);
        res.status(200).json(updatedCategory);
    } catch (e) {
        next(e);
    }
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }

        if (user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                error: "Forbidden - Admin access required"
            });
        }

        const categoryId = req.params.id;

        const deletedCategory = await categoryService.deleteCategory(categoryId as string);
        res.status(200).json(deletedCategory);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Category deletion failed";
        res.status(400).json({
            error: errorMessage,
            details: e
        });
    }
}

export const CategoryController = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};