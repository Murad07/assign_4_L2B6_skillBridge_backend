import { Category } from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        where: {
            isActive: true
        },
        orderBy: {
            name: 'asc'
        },
        include: {
            _count: {
                select: { tutors: true }
            }
        }
    });

    return {
        data: categories,
        total: categories.length
    };
}

const getCategoryById = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        },
        include: {
            tutors: {
                where: {
                    isApproved: true
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            },
            _count: {
                select: { tutors: true }
            }
        }
    });

    return category;
}

const createCategory = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Check if category with same name already exists
    const existingCategory = await prisma.category.findUnique({
        where: {
            name: data.name
        }
    });

    if (existingCategory) {
        throw new Error("Category with this name already exists");
    }

    const result = await prisma.category.create({
        data: data
    });

    return result;
}



export const categoryService = {
    getAllCategories,
    getCategoryById,
    createCategory
};