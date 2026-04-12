import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkReviews() {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                student: { select: { name: true, email: true } }
            }
        });
        console.log("All Reviews in DB:", JSON.stringify(reviews, null, 2));

        const tutorProfiles = await prisma.tutorProfile.findMany({
            select: { id: true, userId: true, user: { select: { name: true } } }
        });
        console.log("Tutor Profiles for ID comparison:", JSON.stringify(tutorProfiles, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkReviews();
