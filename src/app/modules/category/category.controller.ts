import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";
import { UserRole } from "../../middlewares/auth";

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



export const CategoryController = {
    getAllCategories,
    getCategoryById,
    createCategory
};