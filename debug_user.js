import { prisma } from "./src/lib/prisma.js";

async function checkUser(email) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        console.log("User Data in DB:", JSON.stringify(user, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

const email = process.argv[2];
if (email) {
    checkUser(email);
} else {
    console.log("Please provide an email");
}
