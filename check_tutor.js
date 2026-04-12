import { prisma } from "./src/lib/prisma.js";

async function checkTutorData() {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'Tutor' },
            include: { tutorProfile: true }
        });

        console.log("Tutors in DB:", JSON.stringify(users, null, 2));

        const allRoles = await prisma.user.findMany({
            select: { role: true }
        });
        console.log("All unique roles in DB:", [...new Set(allRoles.map(r => r.role))]);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkTutorData();
