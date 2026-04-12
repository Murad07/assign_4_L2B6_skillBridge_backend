import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkTutorRoles() {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'Tutor' },
            select: { id: true, name: true, email: true, phone: true }
        });
        console.log("Tutors in DB:", JSON.stringify(users, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkTutorRoles();
