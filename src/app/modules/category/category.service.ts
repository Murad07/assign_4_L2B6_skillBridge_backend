import { Category } from "@prisma/client";
import { prisma } from "../../../lib/prisma.js";

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

const updateCategory = async (categoryId: string, data: Partial<Category>) => {
    // Check if category exists
    await prisma.category.findUniqueOrThrow({
        where: {
            id: categoryId
        }
    });

    // If name is being updated, check for uniqueness
    if (data.name) {
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: data.name,
                NOT: {
                    id: categoryId
                }
            }
        });

        if (existingCategory) {
            throw new Error("Category with this name already exists");
        }
    }

    const updatedCategory = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: data
    });

    return updatedCategory;
}

const deleteCategory = async (categoryId: string) => {
    // Check if category exists
    await prisma.category.findUniqueOrThrow({
        where: {
            id: categoryId
        }
    });

    // Check if category has any tutors
    const categoryWithTutors = await prisma.category.findUnique({
        where: {
            id: categoryId
        },
        include: {
            _count: {
                select: { tutors: true }
            }
        }
    });

    if (categoryWithTutors && categoryWithTutors._count.tutors > 0) {
        // Soft delete - just mark as inactive
        return await prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                isActive: false
            }
        });
    }

    // Hard delete if no tutors
    return await prisma.category.delete({
        where: {
            id: categoryId
        }
    });
}

export const categoryService = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};