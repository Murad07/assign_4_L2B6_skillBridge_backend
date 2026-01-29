import { prisma } from "../lib/prisma.js";
import config from "../config";

async function seedAdmin() {
    try {
        console.log("***** Admin Seeding Started....")
        const adminData = {
            name: "Admin User",
            email: config.admin.email,
            password: config.admin.password,
            role: 'Admin'
        }
        console.log("***** Checking Admin Exist or not")
        // check user exist on db or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if (existingUser) {
            console.log("Admin user already exists. Skipping creation.");
            return;
        }

        const baseUrl = `http://localhost:${config.port}`;
        const signUpUrl = `${baseUrl}/api/auth/sign-up/email`;

        console.log("***** Sending Admin Sign Up Request to", signUpUrl)

        const signUpAdmin = await fetch(signUpUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": baseUrl,
            },
            body: JSON.stringify(adminData)
        });

        console.log("***** Admin Sign Up Request Sent", signUpAdmin.status)

        if (signUpAdmin.ok) {
            console.log("**** Admin created")
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })

            console.log("**** Email verification status updated!")
        } else {
            const text = await signUpAdmin.text();
            console.error('Sign up failed:', signUpAdmin.status, text);
        }
        console.log("******* SUCCESS ******")

    } catch (error) {
        console.error(error);
    }
}

seedAdmin()