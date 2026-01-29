import { TutorProfile, Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma.js";

const getAllTutors = async (
    {
        search,
        categoryId,
        minPrice,
        maxPrice,
        minRating,
        expertise,
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }: {
        search: string | undefined,
        categoryId: string | undefined,
        minPrice: number | undefined,
        maxPrice: number | undefined,
        minRating: number | undefined,
        expertise: string[] | undefined,
        page: number,
        limit: number,
        skip: number,
        sortBy: string,
        sortOrder: string
    }) => {

    const andConditions: Prisma.TutorProfileWhereInput[] = [
        {
            isApproved: true,
            user: {
                status: 'ACTIVE'
            }
        }
    ];

    // Search by name, bio, or expertise
    if (search) {
        andConditions.push({
            OR: [
                {
                    user: {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    bio: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    expertise: {
                        has: search
                    }
                }
            ]
        });
    }

    // Filter by category
    if (categoryId) {
        andConditions.push({
            categories: {
                some: {
                    id: categoryId
                }
            }
        });
    }

    // Filter by price range
    if (minPrice !== undefined) {
        andConditions.push({
            hourlyRate: {
                gte: minPrice
            }
        });
    }

    if (maxPrice !== undefined) {
        andConditions.push({
            hourlyRate: {
                lte: maxPrice
            }
        });
    }

    // Filter by minimum rating
    if (minRating !== undefined) {
        andConditions.push({
            rating: {
                gte: minRating
            }
        });
    }

    // Filter by expertise
    if (expertise && expertise.length > 0) {
        andConditions.push({
            expertise: {
                hasSome: expertise
            }
        });
    }

    const allTutors = await prisma.tutorProfile.findMany({
        take: limit,
        skip: skip,
        where: {
            AND: andConditions
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true
                }
            },
            categories: {
                select: {
                    id: true,
                    name: true,
                    icon: true
                }
            },
            _count: {
                select: {
                    categories: true
                }
            }
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.tutorProfile.count({
        where: {
            AND: andConditions
        }
    });

    return {
        data: allTutors,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getTutorById = async (tutorId: string) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: {
            id: tutorId,
            isApproved: true
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true,
                    createdAt: true
                }
            },
            categories: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    icon: true
                }
            }
        }
    });

    if (!tutor) {
        return null;
    }

    // Get reviews for this tutor (will be used when review module is implemented)
    // For now, just return tutor data
    return tutor;
}

const createTutorProfile = async (
    data: Omit<TutorProfile, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'rating' | 'totalReviews' | 'totalSessions' | 'isApproved'> & { categoryIds: string[] },
    userId: string
) => {
    // Check if tutor profile already exists
    const existingProfile = await prisma.tutorProfile.findUnique({
        where: {
            userId: userId
        }
    });

    if (existingProfile) {
        throw new Error("Tutor profile already exists");
    }

    // Validate categories exist
    if (data.categoryIds && data.categoryIds.length > 0) {
        const categories = await prisma.category.findMany({
            where: {
                id: {
                    in: data.categoryIds
                }
            }
        });

        if (categories.length !== data.categoryIds.length) {
            throw new Error("One or more category IDs are invalid");
        }
    }

    const { categoryIds, ...profileData } = data;

    const result = await prisma.tutorProfile.create({
        data: {
            ...profileData,
            availability:
                profileData.availability === null
                    ? Prisma.JsonNull
                    : profileData.availability,
            userId,
            categories: {
                connect: categoryIds.map(id => ({ id })),
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            },
            categories: true
        }
    });

    return result;
}

const getMyProfile = async (userId: string) => {
    const profile = await prisma.tutorProfile.findUnique({
        where: {
            userId: userId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true
                }
            },
            categories: {
                select: {
                    id: true,
                    name: true,
                    icon: true
                }
            }
        }
    });

    return profile;
}

const updateTutorProfile = async (
    data: Partial<TutorProfile> & { categoryIds?: string[] },
    userId: string
) => {
    // Check if profile exists
    const profile = await prisma.tutorProfile.findUniqueOrThrow({
        where: {
            userId: userId
        }
    });

    // Admin-only fields should not be updated by tutor
    delete data.isApproved;
    delete data.rating;
    delete data.totalReviews;
    delete data.totalSessions;

    // Validate categories if provided
    if (data.categoryIds && data.categoryIds.length > 0) {
        const categories = await prisma.category.findMany({
            where: {
                id: {
                    in: data.categoryIds
                }
            }
        });

        if (categories.length !== data.categoryIds.length) {
            throw new Error("One or more category IDs are invalid");
        }
    }

    const { categoryIds, ...profileData } = data;

    const updatedProfile = await prisma.tutorProfile.update({
        where: {
            userId: userId
        },
        data: {
            ...profileData,
            availability:
                profileData.availability === null
                    ? Prisma.JsonNull
                    : profileData.availability,
            ...(categoryIds && {
                categories: {
                    set: categoryIds.map(id => ({ id }))
                }
            })
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            },
            categories: true
        }
    });

    return updatedProfile;
}

const updateAvailability = async (userId: string, availability: any) => {
    // Check if profile exists
    await prisma.tutorProfile.findUniqueOrThrow({
        where: {
            userId: userId
        }
    });

    const updatedProfile = await prisma.tutorProfile.update({
        where: {
            userId: userId
        },
        data: {
            availability: availability
        }
    });

    return updatedProfile;
}

const getMySessions = async (userId: string, status?: string) => {
    // Check if tutor profile exists
    await prisma.tutorProfile.findUniqueOrThrow({
        where: {
            userId: userId
        }
    });

    const whereCondition: any = {
        tutorId: userId
    };

    if (status) {
        whereCondition.status = status;
    }

    const sessions = await prisma.booking.findMany({
        where: whereCondition,
        orderBy: {
            sessionDate: 'desc'
        },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true
                }
            },
            review: true
        }
    });

    return {
        data: sessions,
        total: sessions.length
    };
}

const getPendingTutors = async () => {
    const pendingTutors = await prisma.tutorProfile.findMany({
        where: {
            isApproved: false
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true,
                    createdAt: true
                }
            },
            categories: {
                select: {
                    id: true,
                    name: true,
                    icon: true
                }
            }
        }
    });

    return {
        data: pendingTutors,
        total: pendingTutors.length
    };
}

const approveTutor = async (tutorId: string) => {
    // Check if tutor exists
    await prisma.tutorProfile.findUniqueOrThrow({
        where: {
            id: tutorId
        }
    });

    const approvedTutor = await prisma.tutorProfile.update({
        where: {
            id: tutorId
        },
        data: {
            isApproved: true
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return approvedTutor;
}

const rejectTutor = async (tutorId: string) => {
    // Check if tutor exists
    await prisma.tutorProfile.findUniqueOrThrow({
        where: {
            id: tutorId
        }
    });

    const rejectedTutor = await prisma.tutorProfile.update({
        where: {
            id: tutorId
        },
        data: {
            isApproved: false
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return rejectedTutor;
}

export const tutorService = {
    getAllTutors,
    getTutorById,
    createTutorProfile,
    getMyProfile,
    updateTutorProfile,
    updateAvailability,
    getMySessions,
    getPendingTutors,
    approveTutor,
    rejectTutor
};